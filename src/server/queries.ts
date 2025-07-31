import { and, asc, count, desc, ilike, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm/sql/sql";
import { db } from "./db";
import { users } from "./db/schema";

export type GetUsersParams = {
  search?: string | null;
  status?: string | null;
  role?: string | null;
  page?: number;
  pageSize?: number;
  sort?: string[] | null;
};

export const getUsers = async (params: GetUsersParams) => {
  const { search, status, role, page = 1, pageSize = 10, sort } = params;
  // TODO: Remove this artificial delay after testing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const whereConditions: SQL[] = [];

  // Apply search filter
  if (search) {
    const searchCondition = or(
      ilike(users.name, `%${search}%`),
      ilike(users.email, `%${search}%`)
    );
    if (searchCondition) {
      whereConditions.push(searchCondition);
    }
  }

  // Apply status filter
  if (status) {
    whereConditions.push(sql`${users.status} = ${status}`);
  }

  // Apply role filter
  if (role) {
    whereConditions.push(sql`${users.role} = ${role}`);
  }

  // Get total count
  const totalResult = await db
    .select({ total: count() })
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
  const total = totalResult[0]?.total ?? 0;

  // Start building the query
  const query = db
    .select()
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  // Apply sorting
  if (sort && sort.length === 2) {
    const [column, direction] = sort;
    const isAscending = direction === "asc";

    if (column === "id") {
      isAscending
        ? query.orderBy(asc(users.id))
        : query.orderBy(desc(users.id));
    } else if (column === "name") {
      isAscending
        ? query.orderBy(asc(users.name))
        : query.orderBy(desc(users.name));
    } else if (column === "email") {
      isAscending
        ? query.orderBy(asc(users.email))
        : query.orderBy(desc(users.email));
    } else if (column === "status") {
      isAscending
        ? query.orderBy(asc(users.status))
        : query.orderBy(desc(users.status));
    } else if (column === "role") {
      isAscending
        ? query.orderBy(asc(users.role))
        : query.orderBy(desc(users.role));
    } else if (column === "createdAt" || column === "created_at") {
      isAscending
        ? query.orderBy(asc(users.createdAt))
        : query.orderBy(desc(users.createdAt));
    }
    // Add other sorting options as needed
  } else {
    // Default sort by createdAt descending
    query.orderBy(desc(users.createdAt));
  }

  // Apply pagination
  const offset = (page - 1) * pageSize;
  query.limit(pageSize).offset(offset);

  // Execute query
  const data = await query;

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
