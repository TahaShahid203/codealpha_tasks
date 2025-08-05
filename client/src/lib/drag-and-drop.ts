import { type Task } from "@shared/schema";

export interface DragResult {
  sourceIndex: number;
  destinationIndex: number;
  taskIds: string[];
}

export function reorderTasks(tasks: Task[], sourceIndex: number, destinationIndex: number): Task[] {
  const result = Array.from(tasks);
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);
  
  return result.map((task, index) => ({
    ...task,
    order: index,
  }));
}

export function getTaskIds(tasks: Task[]): string[] {
  return tasks.map(task => task.id);
}
