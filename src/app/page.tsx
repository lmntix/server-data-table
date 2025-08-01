import { ErrorFallback } from "@/components/error-fallback";
import { DataTableSkeleton } from "@/components/users/data-table-skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadUserFilterParams } from "@/hooks/use-user-filter-params";
import { HydrateClient, api } from "@/trpc/server";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import UsersTable from "./users-table";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function UsersPage(props: Props) {
  const searchParams = await props.searchParams;
  const filters = loadUserFilterParams(searchParams);
  const sortParams = loadSortParams(searchParams);

  void api.user.list.prefetch({
    search: filters.search,
    status: filters.status,
    role: filters.role,
    page: filters.page,
    pageSize: filters.pageSize,
    sort: sortParams.sort,
  });

  return (
    <HydrateClient>
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
            {" "}
            <ErrorBoundary errorComponent={ErrorFallback}>
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
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
