"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUserFilterParams } from "@/hooks/use-user-filter-params";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

interface DataTablePaginationProps {
	totalPages: number;
	total: number;
}

export function DataTablePagination({
	totalPages,
	total,
}: DataTablePaginationProps) {
	const { filter, setFilter } = useUserFilterParams();

	const { page = 1, pageSize = 10 } = filter;

	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex-1 text-muted-foreground text-sm">
				{total} total users
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="font-medium text-sm">Rows per page</p>
					<Select
						value={`${pageSize}`}
						onValueChange={(value) => {
							setFilter({
								pageSize: Number(value),
								page: 1,
							});
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center font-medium text-sm">
					Page {page} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 bg-transparent p-0 lg:flex"
						onClick={() => setFilter({ page: 1 })}
						disabled={page <= 1}
					>
						<span className="sr-only">Go to first page</span>
						<DoubleArrowLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 bg-transparent p-0"
						onClick={() => setFilter({ page: page - 1 })}
						disabled={page <= 1}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 bg-transparent p-0"
						onClick={() => setFilter({ page: page + 1 })}
						disabled={page >= totalPages}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 bg-transparent p-0 lg:flex"
						onClick={() => setFilter({ page: totalPages })}
						disabled={page >= totalPages}
					>
						<span className="sr-only">Go to last page</span>
						<DoubleArrowRightIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
