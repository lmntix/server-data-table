"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserFilterParams } from "@/hooks/use-user-filter-params"
import { Cross2Icon } from "@radix-ui/react-icons"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"


const statuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
]

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
]

export function DataTableToolbar() {
  const { filter, setFilter, hasFilters } = useUserFilterParams()

  const resetFilters = () => {
    setFilter({
      search: null,
      status: null,
      role: null,
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={filter.search || ""}
          onChange={(event) => setFilter({ search: event.target.value || null })}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilter
          title="Status"
          options={statuses}
          selectedValue={filter.status || ""}
          onSelectionChange={(value) => setFilter({ status: value as "active" | "inactive" | "pending" || null })}
        />
        <DataTableFacetedFilter
          title="Role"
          options={roles}
          selectedValue={filter.role || ""}
          onSelectionChange={(value) => setFilter({ role: value as "admin" | "user" | "moderator" || null })}
        />
        {hasFilters && (
          <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
