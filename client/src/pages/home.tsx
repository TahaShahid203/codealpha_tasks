import { useTaskContext } from "@/contexts/task-context";
import { useTasks } from "@/hooks/use-tasks";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { TaskList } from "@/components/task-list";
import { ProgressBar } from "@/components/progress-bar";
import { TaskModal } from "@/components/task-modal";
import { Search, Grid3X3, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { type Task, type TaskFilter, type TaskSort } from "@shared/schema";
import { isToday, isThisWeek, isPast } from "date-fns";

export default function Home() {
  const { data: tasks = [], isLoading } = useTasks();
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    sortBy,
    setSortBy,
    selectedCategory,
  } = useTaskContext();
  
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Apply status filter
    switch (activeFilter) {
      case "pending":
        filtered = filtered.filter(task => task.status === "pending");
        break;
      case "completed":
        filtered = filtered.filter(task => task.status === "completed");
        break;
      case "overdue":
        filtered = filtered.filter(task => 
          task.status === "pending" && task.dueDate && isPast(new Date(task.dueDate))
        );
        break;
      case "today":
        filtered = filtered.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        );
        break;
      case "this_week":
        filtered = filtered.filter(task => 
          task.dueDate && isThisWeek(new Date(task.dueDate))
        );
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      case "dueDate":
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "created":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // order
        filtered.sort((a, b) => a.order - b.order);
    }

    return filtered;
  }, [tasks, searchQuery, selectedCategory, activeFilter, sortBy]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const pending = total - completed;
    const overdue = tasks.filter(task => 
      task.status === "pending" && task.dueDate && isPast(new Date(task.dueDate))
    ).length;
    
    return {
      total,
      completed,
      pending,
      overdue,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-600 dark:text-gray-300">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-700">
      <Header stats={stats} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar />
          
          <div className="lg:col-span-3">
            {/* Search and Actions Bar */}
            <div className="glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 shadow-xl mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 search-glow transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <Select value={sortBy} onValueChange={(value: TaskSort) => setSortBy(value)}>
                    <SelectTrigger className="px-4 py-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Sort by Order</SelectItem>
                      <SelectItem value="created">Sort by Created</SelectItem>
                      <SelectItem value="priority">Sort by Priority</SelectItem>
                      <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                      <SelectItem value="alphabetical">Sort A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                    className="p-3 rounded-xl glassmorphism bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50"
                  >
                    {viewMode === "list" ? <Grid3X3 className="h-5 w-5" /> : <List className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            </div>

            <ProgressBar stats={stats} />
            <TaskList tasks={filteredAndSortedTasks} viewMode={viewMode} />
          </div>
        </div>
      </main>
      
      <TaskModal />
    </div>
  );
}
