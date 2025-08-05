"use client"

import { useTaskContext } from "@/contexts/task-context"
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks"
import { insertTaskSchema } from "@shared/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FormProviderWrapper,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Save, X, CalendarIcon } from "lucide-react"
import { useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const formSchema = insertTaskSchema.extend({
  dueDate: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function TaskModal() {
  const { isModalOpen, setIsModalOpen, editingTask, setEditingTask } = useTaskContext()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      recurring: "none",
      dueDate: "",
      status: "pending",
    },
  })

  useEffect(() => {
    if (editingTask && editingTask.id) {
      // Edit Mode
      form.reset({
        title: editingTask.title,
        description: editingTask.description || "",
        category: editingTask.category as "work" | "personal" | "study" | "other",
        priority: editingTask.priority as "high" | "medium" | "low",
        recurring: (editingTask.recurring || "none") as "none" | "daily" | "weekly" | "monthly",
        dueDate: editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : "",
        status: (editingTask.status as "pending" | "completed" | "archived") || "pending",
      })
    } else if (isModalOpen && !editingTask) {
      // Add Mode
      form.reset({
        title: "",
        description: "",
        category: "personal",
        priority: "medium",
        recurring: "none",
        dueDate: "",
        status: "pending",
      })
    }
  }, [editingTask, isModalOpen, form])

  const onSubmit = (values: FormValues) => {
    const taskData = {
      ...values,
      dueDate: values.dueDate || undefined,
    }

    const isEdit = editingTask && editingTask.id

    if (isEdit) {
      updateTaskMutation.mutate(
        { id: editingTask.id, ...taskData },
        {
          onSuccess: () => {
            toast({
              title: "Task updated",
              description: "Your task has been successfully updated.",
            })
            handleClose()
          },
          onError: () => {
            toast({
              title: "Error",
              description: "Failed to update task. Please try again.",
              variant: "destructive",
            })
          },
        }
      )
    } else {
      createTaskMutation.mutate(taskData, {
        onSuccess: () => {
          toast({
            title: "Task created",
            description: "Your new task has been successfully created.",
          })
          handleClose()
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to create task. Please try again.",
            variant: "destructive",
          })
        },
      })
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setEditingTask(null)
    form.reset({
      title: "",
      description: "",
      category: "personal",
      priority: "medium",
      recurring: "none",
      dueDate: "",
      status: "pending",
    })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {editingTask ? "Edit Task" : "Add New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {editingTask ? "Update your task details below." : "Create a new task to stay organized."}
          </DialogDescription>
        </DialogHeader>

        <FormProviderWrapper {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("❌ Form validation failed:", errors))} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What needs to be done?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details..." rows={3} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) =>
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                          }
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Recurring */}
            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
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

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={handleClose}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingTask ? "Update Task" : "Save Task"}
              </Button>
            </div>
          </form>
        </FormProviderWrapper>
      </DialogContent>
    </Dialog>
  )
}
