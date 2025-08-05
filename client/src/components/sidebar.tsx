import { useTaskContext } from "@/contexts/task-context";
import { useTasks } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, List, Clock, CheckCircle, AlertTriangle, Calendar, CalendarDays } from "lucide-react";
import { type TaskFilter } from "@shared/schema";
import { useState } from "react";
import { useMemo } from "react";
import { isToday, isThisWeek, isPast } from "date-fns";

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
      setEditingTask(null);
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
                  className={`w-full justify-between px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r from-${filter.color}-500/20 to-${filter.color}-600/20`
                      : `hover:bg-gradient-to-r hover:from-${filter.color}-500/20 hover:to-${filter.color}-600/20`
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`h-4 w-4 mr-3 text-${filter.color}-500`} />
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
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category.key
                      ? `bg-gradient-to-r from-${category.color}-500/20 to-${category.color}-600/20`
                      : `hover:bg-gradient-to-r hover:from-${category.color}-500/20 hover:to-${category.color}-600/20`
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600`} />
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
