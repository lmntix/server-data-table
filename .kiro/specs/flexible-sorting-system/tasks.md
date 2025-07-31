# Implementation Plan

- [x] 1. Update the sort params hook

  - Change `useSortParams` hook to use `parseAsArrayOf(parseAsString)` schema
  - Replace `sortColumn` and `sortDirection` with simple `sort` array
  - _Requirements: 1.1, 2.1, 4.1_

- [x] 2. Update tRPC input schema

  - Replace enum-based sort validation with `sort: z.array(z.string()).optional()`
  - Remove `sortColumn` and `sortDirection` from `listUsersInputSchema`
  - _Requirements: 1.1, 1.3, 5.1_

- [x] 3. Update getUsers query function

  - Replace sortColumn/sortDirection parameters with sort array
  - Add direct case-based sorting logic: `if (sort && sort.length === 2) { const [column, direction] = sort; ... }`
  - Handle columns: name, email, status, role, createdAt with asc/desc cases
  - _Requirements: 3.1, 3.2, 3.4_

- [x] 4. Update user router

  - Pass `sort` array from input to `getUsers` function
  - Remove `sortColumn` and `sortDirection` parameter passing
  - _Requirements: 5.1, 5.2_

- [ ] 5. Fix users table component
  - Update `UsersTable` to properly destructure and pass sort parameters
  - Fix the type errors with the tRPC query
  - _Requirements: 5.3, 5.4_
