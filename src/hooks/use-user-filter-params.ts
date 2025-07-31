import { useQueryStates } from "nuqs";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const userFilterParamsSchema = {
  search: parseAsString,
  status: parseAsStringLiteral(["active", "inactive", "pending"] as const),
  role: parseAsStringLiteral(["admin", "user", "moderator"] as const),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
};

export function useUserFilterParams() {
  const [filter, setFilter] = useQueryStates(userFilterParamsSchema, {
    // Clear URL when values are null/default
    clearOnDefault: true,
    shallow: false,
    // Scroll to top on filter change
    scroll: true,
  });

  return {
    filter,
    setFilter,
    hasFilters: Object.values(filter).some(
      (value) => value !== null && value !== 1 && value !== 10
    ),
  };
}

export const loadUserFilterParams = createLoader(userFilterParamsSchema);
