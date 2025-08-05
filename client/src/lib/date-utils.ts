import { format, isToday, isTomorrow, isThisWeek, isPast, formatDistanceToNow } from "date-fns";

export function formatDueDate(date: Date | string | null): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, "h:mm a")}`;
  }
  
  if (isTomorrow(dateObj)) {
    return `Tomorrow, ${format(dateObj, "h:mm a")}`;
  }
  
  if (isThisWeek(dateObj)) {
    return format(dateObj, "EEEE, h:mm a");
  }
  
  return format(dateObj, "MMM d, h:mm a");
}

export function getTimeRemaining(date: Date | string | null): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isPast(dateObj)) {
    return "Overdue";
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function isDueSoon(date: Date | string | null): boolean {
  if (!date) return false;
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffHours = (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return diffHours <= 24 && diffHours > 0;
}

export function isOverdue(date: Date | string | null): boolean {
  if (!date) return false;
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isPast(dateObj);
}
