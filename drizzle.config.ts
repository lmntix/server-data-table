import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  out: "./migrations",
  casing: "snake_case",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  migrations: {
    table: "migrations",
    schema: "drizzle",
  },
  verbose: true,
  strict: true,
});
