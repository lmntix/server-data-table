import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "./db";
import { type User, users } from "./db/schema";

export interface UsersFilters {
  search?: string | null;
  status?: string | null;
  role?: string | null;
}

export interface UsersPagination {
  page: number;
  pageSize: number;
}

export interface UsersSort {
  column: keyof User;
  direction: "asc" | "desc";
}

export async function getUsers({
  search,
  status,
  role,
  page = 1,
  pageSize = 10,
  sortColumn = "createdAt",
  sortDirection = "desc",
}: {
  search?: string | null;
  status?: string | null;
  role?: string | null;
  page?: number;
  pageSize?: number;
  sortColumn?: keyof User;
  sortDirection?: "asc" | "desc";
}) {
  // TODO: Remove this artificial delay after testing
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Build where conditions
  const conditions = [];

  if (search) {
    conditions.push(
      or(eq(users.name, `%${search}%`), eq(users.email, `%${search}%`))
    );
  }

  if (status) {
    conditions.push(sql`${users.status} = ${status}`);
  }

  if (role) {
    conditions.push(sql`${users.role} = ${role}`);
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const totalResult = await db
    .select({ total: count() })
    .from(users)
    .where(whereClause);
  const total = totalResult[0]?.total ?? 0;

  // Get paginated results
  const orderBy =
    sortDirection === "asc" ? asc(users[sortColumn]) : desc(users[sortColumn]);
  const offset = (page - 1) * pageSize;

  const data = await db
    .select()
    .from(users)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
