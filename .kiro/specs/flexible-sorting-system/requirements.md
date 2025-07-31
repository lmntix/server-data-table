# Requirements Document

## Introduction

This feature aims to refactor the current rigid sorting schema system into a flexible, reusable sorting mechanism that works with URL query parameters. The system should allow simple string-based sorting parameters (e.g., `?sort=name,asc`) that can be easily parsed and applied to any table without requiring predefined schema definitions for each table's sortable columns.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to use a flexible sorting system that doesn't require me to define column schemas for each table, so that I can quickly implement sorting on any data table.

#### Acceptance Criteria

1. WHEN I use the sorting hook THEN the system SHALL accept sort parameters as simple strings without predefined column enums
2. WHEN I pass a sort parameter like "name,asc" THEN the system SHALL parse it into column and direction components
3. WHEN I implement sorting on a new table THEN I SHALL NOT need to define a schema for sortable columns
4. WHEN the sort parameter is malformed THEN the system SHALL fall back to default sorting behavior

### Requirement 2

**User Story:** As a developer, I want URL-based sorting that integrates with nuqs, so that sorting state is preserved in the URL and can be shared or bookmarked.

#### Acceptance Criteria

1. WHEN a user sorts a table THEN the sort parameter SHALL be reflected in the URL as `?sort=column,direction`
2. WHEN a user navigates to a URL with sort parameters THEN the table SHALL be sorted according to those parameters
3. WHEN the sort parameter changes THEN the URL SHALL update without a page refresh
4. WHEN no sort parameter is provided THEN the system SHALL use a sensible default sort order

### Requirement 3

**User Story:** As a developer, I want the sorting logic to be handled at the database query level, so that sorting is efficient and works with pagination.

#### Acceptance Criteria

1. WHEN sort parameters are provided THEN the database query SHALL apply the sorting using Drizzle ORM
2. WHEN sorting by different column types THEN the system SHALL handle string, date, and numeric columns appropriately
3. WHEN sorting by computed fields (like counts) THEN the system SHALL support SQL expressions for sorting
4. WHEN an invalid column is specified THEN the system SHALL ignore the sort and use default ordering

### Requirement 4

**User Story:** As a developer, I want a reusable sorting hook and utilities, so that I can implement consistent sorting across multiple tables in my application.

#### Acceptance Criteria

1. WHEN I import the sorting utilities THEN I SHALL have access to hooks for managing sort state
2. WHEN I use the sorting hook THEN it SHALL provide both current sort state and methods to update it
3. WHEN I implement sorting in a new component THEN I SHALL be able to reuse the same hook pattern
4. WHEN I need to load sort parameters on the server THEN I SHALL have access to server-side utilities

### Requirement 5

**User Story:** As a developer, I want the sorting system to integrate seamlessly with my existing tRPC and infinite query setup, so that I don't need to refactor my existing data fetching logic.

#### Acceptance Criteria

1. WHEN I use the sorting system with tRPC THEN it SHALL work with existing query patterns
2. WHEN I use infinite queries THEN sorting SHALL work correctly with pagination
3. WHEN sort parameters change THEN the query SHALL refetch data with new sorting applied
4. WHEN I use deferred values for search THEN sorting SHALL work alongside search functionality
