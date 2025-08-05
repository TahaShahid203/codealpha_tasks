import { useTaskContext } from "@/contexts/task-context";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { insertTaskSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save, X, CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = insertTaskSchema.extend({
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TaskModal() {
  const { 
    isModalOpen, 
    setIsModalOpen, 
    editingTask, 
    setEditingTask 
  } = useTaskContext();
  
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      recurring: "none",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (editingTask && editingTask.id) {
      // This is an edit operation
      form.reset({
        title: editingTask.title,
        description: editingTask.description || "",
        category: editingTask.category as "work" | "personal" | "study" | "other",
        priority: editingTask.priority as "high" | "medium" | "low",
        recurring: (editingTask.recurring || "none") as "none" | "daily" | "weekly" | "monthly",
        dueDate: editingTask.dueDate 
          ? new Date(editingTask.dueDate).toISOString().slice(0, 16)
          : "",
      });
    } else if (isModalOpen && !editingTask) {
      // This is a new task
      form.reset({
        title: "",
        description: "",
        category: "personal",
        priority: "medium",
        recurring: "none",
        dueDate: "",
      });
    }
  }, [editingTask, isModalOpen, form]);

  const onSubmit = (values: FormValues) => {
    console.log("Form submit - values:", values);
    const taskData = {
      ...values,
      dueDate: values.dueDate || undefined,
    };
    console.log("Task data:", taskData);

    // Check if this is an edit (has an ID) or a new task
    const isEdit = editingTask && editingTask.id;
    console.log("Is edit:", isEdit);
    
    if (isEdit) {
      updateTaskMutation.mutate(
        { id: editingTask.id, ...taskData },
        {
          onSuccess: () => {
            toast({
              title: "Task updated",
              description: "Your task has been successfully updated.",
            });
            handleClose();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to update task. Please try again.",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createTaskMutation.mutate(taskData, {
        onSuccess: () => {
          toast({
            title: "Task created",
            description: "Your new task has been successfully created.",
          });
          handleClose();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create task. Please try again.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleClose = () => {
    console.log("Modal closing");
    setIsModalOpen(false);
    setEditingTask(null);
    form.reset();
  };

  console.log("TaskModal render - isModalOpen:", isModalOpen, "editingTask:", editingTask);
  
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] glassmorphism bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl p-8 gradient-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {editingTask && editingTask.id ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {editingTask && editingTask.id ? "Update your task details below." : "Create a new task to stay organized."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Task Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What needs to be done?"
                      className="w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 focus:ring-2 focus:ring-indigo-500 search-glow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 focus:ring-2 focus:ring-indigo-500 search-glow resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Priority
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 focus:ring-2 focus:ring-indigo-500 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? date.toISOString().slice(0, 10) : "");
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Repeat
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Repeat</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingTask && editingTask.id ? "Update Task" : "Save Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
