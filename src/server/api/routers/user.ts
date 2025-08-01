import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { getUsers } from "@/server/queries";

// Generate schema from drizzle table
const userSchema = createSelectSchema(users);

// Create input schema for the list query
const listUsersInputSchema = z.object({
  search: z.string().nullable(),
  status: z.enum(["active", "inactive", "pending"]).nullable(),
  role: z.enum(["admin", "user", "moderator"]).nullable(),
  page: z.number(),
  pageSize: z.number(),
  sort: z.array(z.string(), z.string()).nullable().optional(),
});

export const userRouter = createTRPCRouter({
  list: publicProcedure.input(listUsersInputSchema).query(async ({ input }) => {
    return await getUsers(input);
  }),
});
