"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSortParams } from "@/hooks/use-sort-params";
import type { User } from "@/server/db/schema";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import type React from "react";

const StatusBadge = ({ status }: { status: string }) => {
  const variant =
    status === "active"
      ? "default"
      : status === "inactive"
      ? "destructive"
      : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
};

const RoleBadge = ({ role }: { role: string }) => {
  const variant =
    role === "admin"
      ? "default"
      : role === "moderator"
      ? "secondary"
      : "outline";
  return <Badge variant={variant}>{role}</Badge>;
};

function SortableHeader({
  column,
  children,
}: {
  column: string;
  children: React.ReactNode;
}) {
  const { params, setParams } = useSortParams();

  const [currentColumn, currentDirection] = params.sort || [];
  const isSorted = currentColumn === column;
  const isAsc = isSorted && currentDirection === "asc";
  const isDesc = isSorted && currentDirection === "desc";

  const getSortIcon = () => {
    if (isAsc) return <ArrowUp className="ml-2 h-4 w-4" />;
    if (isDesc) return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const handleSort = () => {
    if (currentColumn === column && currentDirection === "asc") {
      // If currently ascending on this column, switch to descending
      setParams({ sort: [column, "desc"] });
    } else if (currentColumn === column && currentDirection === "desc") {
      // If currently descending on this column, clear sort
      setParams({ sort: null });
    } else {
      // If not sorted on this column, set to ascending
      setParams({ sort: [column, "asc"] });
    }
  };

  return (
    <Button variant="ghost" onClick={handleSort}>
      {children}
      {getSortIcon()}
    </Button>
  );
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <SortableHeader column="name">Name</SortableHeader>,
  },
  {
    accessorKey: "email",
    header: () => <SortableHeader column="email">Email</SortableHeader>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <RoleBadge role={row.getValue("role")} />,
  },
  {
    accessorKey: "createdAt",
    header: () => <SortableHeader column="createdAt">Created</SortableHeader>,
    cell: ({ row }) => {
      const epoch = row.getValue("createdAt"); // Assuming epoch is in milliseconds
      const date = new Date(Number(epoch)); // Ensure epoch is converted to number
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View user</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
