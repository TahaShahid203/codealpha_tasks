import React, { createContext, useContext, useState } from "react";
import { type Task, type TaskFilter, type TaskSort } from "@shared/schema";

interface TaskContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: TaskFilter;
  setActiveFilter: (filter: TaskFilter) => void;
  sortBy: TaskSort;
  setSortBy: (sort: TaskSort) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");
  const [sortBy, setSortBy] = useState<TaskSort>("order");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <TaskContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        sortBy,
        setSortBy,
        selectedCategory,
        setSelectedCategory,
        isModalOpen,
        setIsModalOpen,
        editingTask,
        setEditingTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
