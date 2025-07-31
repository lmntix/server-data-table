import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";

export const sortParamsSchema = {
  sortColumn: parseAsString.withDefault("createdAt"),
  sortDirection: parseAsString.withDefault("desc"),
};

export function useSortParams() {
  const [params, setParams] = useQueryStates(sortParamsSchema, {
    // Trigger navigation to re-render server component
    shallow: false,
    // Scroll to top on sort change
    scroll: true,
  });
  return { params, setParams };
}

export const loadSortParams = createLoader(sortParamsSchema);
