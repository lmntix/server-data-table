# Design Document

## Overview

The flexible sorting system will replace the current rigid schema-based approach with a simple string-based sorting mechanism. The system will use a single `sort` parameter that accepts an array of exactly 2 strings: `[column, direction]` (e.g., `["name", "asc"]`), making it reusable across different tables without requiring predefined column enums.

## Architecture

### Current State Analysis

- **Current Hook**: `useSortParams()` uses separate `sortColumn` and `sortDirection` parameters
- **Current tRPC Schema**: Defines enum-based validation for each table's sortable columns
- **Current Query Logic**: Uses typed column names with Drizzle ORM ordering

### Proposed Architecture

- **Simple Sort Parameter**: Single `sort` array parameter with exactly 2 elements: `[column, direction]`
- **Single Column Sorting**: Only one column can be sorted at a time (no multi-column sorting)
- **Direct Query Logic**: Handle sorting directly in query functions with simple case statements
- **Fallback Strategy**: Use default sorting when invalid columns are specified

## Components and Interfaces

### 1. Updated Sort Hook (`useSortParams`)

```typescript
// Simple schema with array of exactly 2 strings: [column, direction]
export const sortParamsSchema = {
  sort: parseAsArrayOf(parseAsString),
};

export function useSortParams() {
  const [params, setParams] = useQueryStates(sortParamsSchema);

  return { params, setParams };
}
```

### 2. Data Table Header Component Usage

```typescript
export function DataTableHeader({ table, loading, tableScroll }: Props) {
  const { params, setParams } = useSortParams();

  const [column, value] = params.sort || [];

  const createSortQuery = useCallback(
    (name: string) => {
      if (column === name && value === "asc") {
        // If currently ascending on this column, switch to descending
        setParams({ sort: [name, "desc"] });
      } else if (column === name && value === "desc") {
        // If currently descending on this column, clear sort
        setParams({ sort: null });
      } else {
        // If not sorted on this column, set to ascending
        setParams({ sort: [name, "asc"] });
      }
    },
    [column, value, setParams]
  );

  // Rest of component implementation
}
```

### 3. Updated tRPC Input Schema

```typescript
// Generic sort input that works for any table
const listUsersInputSchema = z.object({
  search: z.string().nullable(),
  status: z.string().nullable(),
  role: z.string().nullable(),
  page: z.number(),
  pageSize: z.number(),
  sort: z.array(z.string()).optional(), // Simple string array [column, direction]
});
```

### 4. Direct Query Logic

```typescript
// In getUsers function - simple and direct
export async function getUsers({
  search,
  status,
  role,
  page = 1,
  pageSize = 10,
  sort,
}: {
  search?: string | null;
  status?: string | null;
  role?: string | null;
  page?: number;
  pageSize?: number;
  sort?: string[];
}) {
  // ... existing filter logic ...

  // Apply sorting
  if (sort && sort.length === 2) {
    const [column, direction] = sort;
    const isAscending = direction === "asc";

    if (column === "name") {
      query = isAscending
        ? query.orderBy(asc(users.name))
        : query.orderBy(desc(users.name));
    } else if (column === "email") {
      query = isAscending
        ? query.orderBy(asc(users.email))
        : query.orderBy(desc(users.email));
    } else if (column === "status") {
      query = isAscending
        ? query.orderBy(asc(users.status))
        : query.orderBy(desc(users.status));
    } else if (column === "role") {
      query = isAscending
        ? query.orderBy(asc(users.role))
        : query.orderBy(desc(users.role));
    } else if (column === "createdAt") {
      query = isAscending
        ? query.orderBy(asc(users.createdAt))
        : query.orderBy(desc(users.createdAt));
    }
    // Add other columns as needed
  } else {
    // Default sort by created_at descending
    query = query.orderBy(desc(users.createdAt));
  }

  // ... rest of query logic ...
}
```

## Data Models

### Sort Parameter Format

- **Single Sort**: `["name", "asc"]`
- **Clear Sort**: `null` or `undefined`
- **URL Representation**: `?sort=name&sort=asc`

## Error Handling

### Invalid Column Names

- **Strategy**: Ignore invalid columns and fall back to default sorting
- **Implementation**: Only apply sorting for known column names in case statements

### Malformed Sort Parameters

- **Strategy**: Ignore malformed parameters and use default sorting
- **Examples**:
  - `["name"]` (missing direction) → use default sort
  - `["name", "invalid"]` (invalid direction) → use default sort
  - `["name", "asc", "extra"]` (too many elements) → use default sort

## Testing Strategy

### Unit Tests

1. **Hook Functionality**

   - Parameter state management
   - URL synchronization
   - Sort cycling logic (asc → desc → clear)

2. **Query Logic**
   - Valid column sorting with different directions
   - Invalid column handling
   - Default sort fallback

### Integration Tests

1. **tRPC Integration**

   - Sort parameters passed correctly to queries
   - Database query generation with proper ORDER BY clauses

2. **Component Integration**
   - Table header click updates sort parameters correctly
   - URL updates reflect in component state

## Migration Strategy

### Simple 5-Step Process

1. Update sort hook to use array schema
2. Update tRPC input schema to accept sort array
3. Update query function with direct case-based sorting
4. Update router to pass sort array
5. Fix component type errors
