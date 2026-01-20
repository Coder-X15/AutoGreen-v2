import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  organization: text("organization"),
});

export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  healthStatus: text("health_status").notNull(), // e.g., "Good", "Needs Water"
  imageUrl: text("image_url"),
});

export const trends = pgTable("trends", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  dueDate: timestamp("due_date"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPlantSchema = createInsertSchema(plants).omit({ id: true });
export const insertTrendSchema = createInsertSchema(trends).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type Trend = typeof trends.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Message = typeof messages.$inferSelect;

// Request Types
export type LoginRequest = { username: string; password: string };
export type UpdateProfileRequest = Partial<InsertUser>;
