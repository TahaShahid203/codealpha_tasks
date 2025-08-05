import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { CheckSquare, Moon, Sun } from "lucide-react";

interface HeaderProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
}

export function Header({ stats }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glassmorphism bg-white/70 dark:bg-slate-800/70 border-b border-white/20 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <CheckSquare className="text-white h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow Pro
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="glassmorphism bg-white/50 dark:bg-slate-700/50 px-3 py-1.5 rounded-full">
                <span className="text-gray-600 dark:text-gray-300">Total:</span>
                <span className="font-semibold ml-1">{stats.total}</span>
              </div>
              <div className="glassmorphism bg-emerald-100/70 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
                <span className="text-emerald-700 dark:text-emerald-300">Done:</span>
                <span className="font-semibold ml-1">{stats.completed}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg glassmorphism bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-600/50"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
