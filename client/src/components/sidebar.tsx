import { useTaskContext } from "@/contexts/task-context";
import { useTasks } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, List, Clock, CheckCircle, AlertTriangle, Calendar, CalendarDays } from "lucide-react";
import { type TaskFilter } from "@shared/schema";
import { useState, useMemo } from "react";
import { isToday, isThisWeek, isPast } from "date-fns";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { data: tasks = [] } = useTasks();
  const {
    activeFilter,
    setActiveFilter,
    selectedCategory,
    setSelectedCategory,
    setIsModalOpen,
    setEditingTask,
  } = useTaskContext();
  
  const [quickTaskTitle, setQuickTaskTitle] = useState("");

  const getCategoryActiveClass = (color: string) => {
    switch (color) {
      case "blue": return "bg-gradient-to-r from-blue-500/20 to-blue-600/20";
      case "emerald": return "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20";
      case "purple": return "bg-gradient-to-r from-purple-500/20 to-purple-600/20";
      case "gray": return "bg-gradient-to-r from-gray-500/20 to-gray-600/20";
      default: return "bg-gradient-to-r from-gray-500/20 to-gray-600/20";
    }
  };

  const getCategoryHoverClass = (color: string) => {
    switch (color) {
      case "blue": return "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10";
      case "emerald": return "hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-emerald-600/10";
      case "purple": return "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-purple-600/10";
      case "gray": return "hover:bg-gradient-to-r hover:from-gray-500/10 hover:to-gray-600/10";
      default: return "hover:bg-gradient-to-r hover:from-gray-500/10 hover:to-gray-600/10";
    }
  };

  const getCategoryBulletClass = (color: string) => {
    switch (color) {
      case "blue": return "from-blue-500 to-blue-600";
      case "emerald": return "from-emerald-500 to-emerald-600";
      case "purple": return "from-purple-500 to-purple-600";
      case "gray": return "from-gray-500 to-gray-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const filterCounts = useMemo(() => {
    const all = tasks.length;
    const pending = tasks.filter(task => task.status === "pending").length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const overdue = tasks.filter(task => 
      task.status === "pending" && task.dueDate && isPast(new Date(task.dueDate))
    ).length;
    const today = tasks.filter(task => 
      task.dueDate && isToday(new Date(task.dueDate))
    ).length;
    const thisWeek = tasks.filter(task => 
      task.dueDate && isThisWeek(new Date(task.dueDate))
    ).length;

    return { all, pending, completed, overdue, today, this_week: thisWeek };
  }, [tasks]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach(task => {
      counts[task.category] = (counts[task.category] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTaskTitle.trim()) {
      // First set the editing task to include the quick title
      setEditingTask({
        id: '',
        title: quickTaskTitle.trim(),
        description: null,
        category: 'personal',
        priority: 'medium',
        status: 'pending',
        dueDate: null,
        completedAt: null,
        recurring: 'none',
        subtasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0,
      });
      setIsModalOpen(true);
      setQuickTaskTitle("");
    }
  };

  const filterOptions: { key: TaskFilter; label: string; icon: any; color: string }[] = [
    { key: "all", label: "All Tasks", icon: List, color: "indigo" },
    { key: "pending", label: "Pending", icon: Clock, color: "amber" },
    { key: "completed", label: "Completed", icon: CheckCircle, color: "emerald" },
    { key: "overdue", label: "Overdue", icon: AlertTriangle, color: "red" },
    { key: "today", label: "Today", icon: Calendar, color: "blue" },
    { key: "this_week", label: "This Week", icon: CalendarDays, color: "purple" },
  ];

  const categories = [
    { key: "work", label: "Work", color: "blue" },
    { key: "personal", label: "Personal", color: "emerald" },
    { key: "study", label: "Study", color: "purple" },
    { key: "other", label: "Other", color: "gray" },
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="space-y-6">
        {/* Quick Add Task */}
        <div className="glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 gradient-border shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Add</h2>
          <form onSubmit={handleQuickAdd} className="space-y-4">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={quickTaskTitle}
              onChange={(e) => setQuickTaskTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 focus:ring-2 focus:ring-indigo-500 search-glow"
            />
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </form>
        </div>

        {/* Filters */}
        <div className="glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filters</h3>
          <div className="space-y-3">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.key;
              return (
                <Button
                  key={filter.key}
                  variant="ghost"
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    "w-full justify-between px-4 py-2 rounded-lg transition-all duration-300",
                    isActive && "bg-gradient-to-r from-indigo-500/20 to-purple-500/20",
                    !isActive && "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10" 
                  )}
                >
                  <div className="flex items-center">
                    <Icon className={cn(
                      "h-4 w-4 mr-3",
                      filter.color === "indigo" && "text-indigo-500",
                      filter.color === "amber" && "text-amber-500", 
                      filter.color === "emerald" && "text-emerald-500",
                      filter.color === "red" && "text-red-500",
                      filter.color === "blue" && "text-blue-500",
                      filter.color === "purple" && "text-purple-500"
                    )} />
                    <span className="text-gray-700 dark:text-gray-200">{filter.label}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filterCounts[filter.key] || 0}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.key} className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.key ? null : category.key
                  )}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300",
                    selectedCategory === category.key && getCategoryActiveClass(category.color),
                    selectedCategory !== category.key && getCategoryHoverClass(category.color)
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full bg-gradient-to-r",
                    getCategoryBulletClass(category.color)
                  )} />
                  <span className="text-gray-700 dark:text-gray-200">{category.label}</span>
                </Button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {categoryCounts[category.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
