interface ProgressBarProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
}

export function ProgressBar({ stats }: ProgressBarProps) {
  return (
    <div className="glassmorphism bg-white/70 dark:bg-slate-800/70 rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Progress</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{stats.percentage}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-700 animate-pulse-slow"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
        <span>{stats.completed} completed</span>
        <span>{stats.pending} remaining</span>
      </div>
    </div>
  );
}
