import { env } from "@/env";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case",
  schema,
});

export type db = typeof db;

export default db;
