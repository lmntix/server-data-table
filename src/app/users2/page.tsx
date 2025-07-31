import { DataTableSkeleton } from "@/components/users/data-table-skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadUserFilterParams } from "@/hooks/use-user-filter-params";
import type { User } from "@/server/db/schema";
import { getUsers } from "@/server/queries";
import { api } from "@/trpc/server";
import { QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import UsersTable from "./users2-table";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsersPage(props: Props) {
  const searchParams = await props.searchParams;
  const filters = loadUserFilterParams(searchParams);
  const sort = loadSortParams(searchParams);

  void api.user.list.prefetch({
    ...filters,
    ...sort,
  });

  return (
    <div className="container mx-auto py-10">
      <div>
        <div className="mb-6">
          <h1 className="font-bold text-2xl">Users</h1>
          <p className="text-muted-foreground">
            Manage your users with server-side filtering, sorting, and
            pagination.
          </p>
        </div>
        <div>
          <Suspense
            fallback={
              <DataTableSkeleton
                cellWidths={[
                  "10rem",
                  "30rem",
                  "10rem",
                  "10rem",
                  "6rem",
                  "6rem",
                  "6rem",
                ]}
                columnCount={6}
                shrinkZero
              />
            }
          >
            <UsersTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
