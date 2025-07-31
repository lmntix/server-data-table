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
  sortColumn: z
    .enum(["id", "name", "email", "status", "role", "createdAt"])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export const userRouter = createTRPCRouter({
  list: publicProcedure.input(listUsersInputSchema).query(async ({ input }) => {
    return await getUsers({
      search: input.search,
      status: input.status,
      role: input.role,
      page: input.page,
      pageSize: input.pageSize,
      sortColumn: input.sortColumn,
      sortDirection: input.sortDirection,
    });
  }),
});
