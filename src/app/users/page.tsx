import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import  { DataTableSkeleton } from "@/components/users/data-table-skeleton";
import { loadSortParams } from "@/hooks/use-sort-params";
import { loadUserFilterParams } from "@/hooks/use-user-filter-params";
import type { User } from "@/server/db/schema";
import { getUsers } from "@/server/queries";
import { Suspense } from "react";
import UsersTable from "./users-table";

interface Props {
	searchParams: Promise<Record<string, string | string[] | undefined>>
  }

export default async function UsersPage(props: Props) {
	const searchParams = await props.searchParams
	const filterParams = loadUserFilterParams(searchParams);
	const sortParams = loadSortParams(searchParams);

	// Create the promise but don't await it
	const usersPromise = getUsers({
		search: filterParams.search,
		status: filterParams.status,
		role: filterParams.role,
		page: filterParams.page,
		pageSize: filterParams.pageSize,
		sortColumn: sortParams.sortColumn as keyof User,
		sortDirection: sortParams.sortDirection as "asc" | "desc",
	});

	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Users</CardTitle>
					<CardDescription>
						Manage your users with server-side filtering, sorting, and
						pagination.
					</CardDescription>
				</CardHeader>
				<CardContent>
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
                "6rem"
              ]}
              columnCount={6}
              shrinkZero
            />
          }
        >
						<UsersTable usersPromise={usersPromise} />
					</Suspense>
				</CardContent>
			</Card>
		</div>
	);
}



