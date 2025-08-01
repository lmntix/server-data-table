"use client";

import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import { DataTablePagination } from "@/components/users/data-table-pagination";
import { DataTableToolbar } from "@/components/users/data-table-toolbar";
import { useSortParams } from "@/hooks/use-sort-params";
import { useUserFilterParams } from "@/hooks/use-user-filter-params";
import { api } from "@/trpc/react";

export default function UsersTable() {
  const { filter } = useUserFilterParams();
  const { params } = useSortParams();

  const [result] = api.user.list.useSuspenseQuery({
    search: filter.search,
    status: filter.status,
    role: filter.role,
    page: filter.page,
    pageSize: filter.pageSize,
    sort: params.sort,
  });

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
