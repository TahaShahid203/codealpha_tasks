import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("personal"),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  status: text("status").notNull().default("pending"), // pending, completed, archived
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  recurring: text("recurring").default("none"), // none, daily, weekly, monthly
  subtasks: jsonb("subtasks").$type<Subtask[]>().default([]),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  order: integer("order").notNull().default(0),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Subtask type
export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

// Insert schemas
export const insertTaskSchema = createInsertSchema(tasks, {
  title: z.string().min(1, "Title is required"),
  category: z.enum(["work", "personal", "study", "other"]),
  priority: z.enum(["high", "medium", "low"]),
  status: z.enum(["pending", "completed", "archived"]),
  recurring: z.enum(["none", "daily", "weekly", "monthly"]),
  dueDate: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const updateTaskSchema = insertTaskSchema.partial().extend({
  id: z.string(),
});

export const addSubtaskSchema = z.object({
  taskId: z.string(),
  title: z.string().min(1, "Subtask title is required"),
});

export const toggleSubtaskSchema = z.object({
  taskId: z.string(),
  subtaskId: z.string(),
});

// Types
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Filter and sort types
export type TaskFilter = "all" | "pending" | "completed" | "overdue" | "today" | "this_week";
export type TaskSort = "created" | "priority" | "dueDate" | "alphabetical" | "order";

// Activity log entry
export type ActivityEntry = {
  id: string;
  action: "created" | "updated" | "completed" | "deleted" | "archived";
  taskTitle: string;
  timestamp: string;
  details?: string;
};
