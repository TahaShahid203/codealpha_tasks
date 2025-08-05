import { type Task } from "@shared/schema";
import { TaskItem } from "./task-item";
import { useReorderTasks } from "@/hooks/use-tasks";
import { useState } from "react";
import { reorderTasks } from "@/lib/drag-and-drop";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  tasks: Task[];
  viewMode: "list" | "grid";
}

export function TaskList({ tasks, viewMode }: TaskListProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const reorderTasksMutation = useReorderTasks();

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedTaskId) return;
    
    const dragIndex = tasks.findIndex(task => task.id === draggedTaskId);
    if (dragIndex === -1 || dragIndex === dropIndex) return;
    
    const reorderedTasks = reorderTasks(tasks, dragIndex, dropIndex);
    const taskIds = reorderedTasks.map(task => task.id);
    
    reorderTasksMutation.mutate(taskIds);
    
    setDraggedTaskId(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverIndex(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-12 shadow-xl text-center">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No tasks found</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0" : ""}`}>
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, task.id)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${
            dragOverIndex === index ? "transform scale-105" : ""
          } ${draggedTaskId === task.id ? "opacity-50" : ""}`}
        >
          <TaskItem task={task} />
        </div>
      ))}
    </div>
  );
}
