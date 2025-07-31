import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  status: text("status", { enum: ["active", "inactive", "pending"] })
    .notNull()
    .default("pending"),
  role: text("role", { enum: ["admin", "user", "moderator"] })
    .notNull()
    .default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
