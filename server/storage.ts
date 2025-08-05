import { type Task, type InsertTask, type UpdateTask, type Category, type InsertCategory, type Subtask, type ActivityEntry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Task operations
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(task: UpdateTask): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  reorderTasks(taskIds: string[]): Promise<void>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Subtask operations
  addSubtask(taskId: string, title: string): Promise<Task>;
  toggleSubtask(taskId: string, subtaskId: string): Promise<Task>;
  
  // Activity log
  getActivityLog(): Promise<ActivityEntry[]>;
  addActivityEntry(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): Promise<void>;
}

export class MemStorage implements IStorage {
  private tasks: Map<string, Task>;
  private categories: Map<string, Category>;
  private activityLog: ActivityEntry[];

  constructor() {
    this.tasks = new Map();
    this.categories = new Map();
    this.activityLog = [];
    
    // Initialize default categories
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
    const defaultCategories: Category[] = [
      { id: randomUUID(), name: "Work", color: "blue", createdAt: new Date() },
      { id: randomUUID(), name: "Personal", color: "emerald", createdAt: new Date() },
      { id: randomUUID(), name: "Study", color: "purple", createdAt: new Date() },
      { id: randomUUID(), name: "Other", color: "gray", createdAt: new Date() },
    ];
    
    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => a.order - b.order);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      status: "pending",
      subtasks: [],
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      order: this.tasks.size,
      dueDate: insertTask.dueDate ? new Date(insertTask.dueDate) : null,
    };
    
    this.tasks.set(id, task);
    
    await this.addActivityEntry({
      action: "created",
      taskTitle: task.title,
      details: `Task created with ${task.priority} priority`,
    });
    
    return task;
  }

  async updateTask(updateTask: UpdateTask): Promise<Task> {
    const existingTask = this.tasks.get(updateTask.id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    const wasCompleted = existingTask.status === "completed";
    const updatedTask: Task = {
      ...existingTask,
      ...updateTask,
      updatedAt: new Date(),
      dueDate: updateTask.dueDate ? new Date(updateTask.dueDate) : existingTask.dueDate,
      completedAt: updateTask.status === "completed" && !wasCompleted ? new Date() : 
                   updateTask.status !== "completed" ? null : existingTask.completedAt,
    };

    this.tasks.set(updateTask.id, updatedTask);

    if (updateTask.status === "completed" && !wasCompleted) {
      await this.addActivityEntry({
        action: "completed",
        taskTitle: updatedTask.title,
      });
    } else {
      await this.addActivityEntry({
        action: "updated",
        taskTitle: updatedTask.title,
      });
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = this.tasks.get(id);
    if (!task) {
      return false;
    }

    this.tasks.delete(id);
    
    await this.addActivityEntry({
      action: "deleted",
      taskTitle: task.title,
    });

    return true;
  }

  async reorderTasks(taskIds: string[]): Promise<void> {
    taskIds.forEach((id, index) => {
      const task = this.tasks.get(id);
      if (task) {
        task.order = index;
        task.updatedAt = new Date();
      }
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    
    this.categories.set(id, category);
    return category;
  }

  async addSubtask(taskId: string, title: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const subtask: Subtask = {
      id: randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTask: Task = {
      ...task,
      subtasks: [...task.subtasks, subtask],
      updatedAt: new Date(),
    };

    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  async toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
      updatedAt: new Date(),
    };

    this.tasks.set(taskId, updatedTask);
    return updatedTask;
  }

  async getActivityLog(): Promise<ActivityEntry[]> {
    return this.activityLog.slice().reverse(); // Return most recent first
  }

  async addActivityEntry(entry: Omit<ActivityEntry, 'id' | 'timestamp'>): Promise<void> {
    const activityEntry: ActivityEntry = {
      ...entry,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    };
    
    this.activityLog.push(activityEntry);
    
    // Keep only last 100 entries
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(-100);
    }
  }
}

export const storage = new MemStorage();
