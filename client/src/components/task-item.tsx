import { type Task } from "@shared/schema";
import { useUpdateTask, useDeleteTask, useAddSubtask, useToggleSubtask } from "@/hooks/use-tasks";
import { useTaskContext } from "@/contexts/task-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  GripVertical, 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  Plus, 
  Archive,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { formatDueDate, getTimeRemaining, isOverdue, isDueSoon } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { setEditingTask, setIsModalOpen } = useTaskContext();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const addSubtaskMutation = useAddSubtask();
  const toggleSubtaskMutation = useToggleSubtask();
  const { toast } = useToast();
  
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const isCompleted = task.status === "completed";
  const overdue = task.dueDate && isOverdue(task.dueDate);
  const dueSoon = task.dueDate && isDueSoon(task.dueDate);

  const priorityColors: Record<string, string> = {
    high: "border-red-500",
    medium: "border-amber-500",
    low: "border-emerald-500",
  };

  const priorityBadgeColors: Record<string, string> = {
    high: "bg-gradient-to-r from-red-500 to-red-600",
    medium: "bg-gradient-to-r from-amber-500 to-amber-600",
    low: "bg-gradient-to-r from-emerald-500 to-emerald-600",
  };

  const categoryColors: Record<string, string> = {
    work: "from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-700/50",
    personal: "from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-700/50",
    study: "from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-700/50",
    other: "from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/50",
  };

  const handleToggleComplete = () => {
    updateTaskMutation.mutate({
      id: task.id,
      status: isCompleted ? "pending" : "completed",
    });
  };

  const handleEdit = () => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(task.id, {
        onSuccess: () => {
          toast({
            title: "Task deleted",
            description: "The task has been successfully deleted.",
          });
        },
      });
    }
  };

  const handleArchive = () => {
    updateTaskMutation.mutate({
      id: task.id,
      status: "archived",
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtaskMutation.mutate({
        taskId: task.id,
        title: newSubtaskTitle.trim(),
      }, {
        onSuccess: () => {
          setNewSubtaskTitle("");
          setShowSubtaskInput(false);
        },
      });
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtaskMutation.mutate({
      taskId: task.id,
      subtaskId,
    });
  };

  return (
    <div className={cn(
      "task-item glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 shadow-xl border-l-4 transition-all duration-300",
      priorityColors[task.priority] || "border-gray-300",
      isCompleted && "opacity-60"
    )}>
      <div className="flex items-start space-x-4">
        <div className="drag-handle mt-1 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </div>
        
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={cn(
              "text-lg font-medium text-gray-800 dark:text-white",
              isCompleted && "line-through opacity-60"
            )}>
              {task.title}
            </h4>
            <div className="flex items-center space-x-2">
              <span className={cn(
                "text-white text-xs font-medium px-3 py-1 rounded-full",
                priorityBadgeColors[task.priority] || "bg-gray-500"
              )}>
                {task.priority.toUpperCase()}
              </span>
              <span className={cn(
                "text-xs font-medium px-3 py-1 rounded-full border bg-gradient-to-r",
                categoryColors[task.category] || "from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-300"
              )}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>
            </div>
          </div>
          
          {task.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
              {task.description}
            </p>
          )}
          
          {task.dueDate && (
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className={cn(
                    "h-4 w-4 mr-2",
                    overdue ? "text-red-500" : dueSoon ? "text-amber-500" : ""
                  )} />
                  Due: 
                  <span className={cn(
                    "font-medium ml-1",
                    overdue ? "text-red-600 dark:text-red-400" : 
                    dueSoon ? "text-amber-600 dark:text-amber-400" : ""
                  )}>
                    {formatDueDate(task.dueDate)}
                  </span>
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {getTimeRemaining(task.dueDate)}
                </span>
              </div>
            </div>
          )}

          {isCompleted && task.completedAt && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
              Completed: {formatDueDate(task.completedAt)}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20"
              >
                <Edit2 className="h-4 w-4 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20"
              >
                <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600 dark:hover:text-red-400" />
              </Button>
              {!isCompleted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSubtaskInput(!showSubtaskInput)}
                  className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-emerald-500/20 hover:to-green-500/20"
                >
                  <Plus className="h-4 w-4 text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400" />
                </Button>
              )}
              {isCompleted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleArchive}
                  className="p-2 rounded-lg hover:bg-gradient-to-r hover:from-gray-500/20 hover:to-slate-500/20"
                >
                  <Archive className="h-4 w-4 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Subtasks */}
          {((task.subtasks && task.subtasks.length > 0) || showSubtaskInput) && (
            <div className="mt-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {(task.subtasks || []).map((subtask) => (
                <div key={subtask.id} className="flex items-center space-x-3">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => handleToggleSubtask(subtask.id)}
                    className="h-4 w-4"
                  />
                  <span className={cn(
                    "text-sm text-gray-600 dark:text-gray-300",
                    subtask.completed && "line-through opacity-60"
                  )}>
                    {subtask.title}
                  </span>
                </div>
              ))}
              
              {showSubtaskInput && (
                <form onSubmit={handleAddSubtask} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 text-sm py-1 px-2 h-8"
                    autoFocus
                  />
                  <Button type="submit" size="sm" variant="ghost" className="h-8 px-2">
                    Add
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
