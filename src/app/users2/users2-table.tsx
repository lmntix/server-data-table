"use client";

import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import { DataTablePagination } from "@/components/users/data-table-pagination";
import { DataTableToolbar } from "@/components/users/data-table-toolbar";
import { useSortParams } from "@/hooks/use-sort-params";
import { useUserFilterParams } from "@/hooks/use-user-filter-params";
import type { User } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { use } from "react";

interface UsersTableProps {
  usersPromise: Promise<{
    data: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
}

export default function UsersTable() {
  const filters = useUserFilterParams();
  const sort = useSortParams();
  const result = api.user.list.useSuspenseQuery({ ...filters, ...sort });

  return (
    <div className="space-y-4">
      <DataTableToolbar />
      <DataTable columns={columns} data={result.data} />
      <DataTablePagination
        totalPages={result.totalPages}
        total={result.total}
      />
    </div>
  );
}
