
"use client";

import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import { DataTablePagination } from "@/components/users/data-table-pagination";
import { DataTableToolbar } from "@/components/users/data-table-toolbar";
import type { User } from "@/server/db/schema";
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

export default function UsersTable({ usersPromise }: UsersTableProps) {
	const result = use(usersPromise);

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