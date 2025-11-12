# Shared Types

**Purpose**: Common TypeScript types and interfaces.

## Categories

- `common.ts` — Base types (ID, Timestamp, Status)
- `api.ts` — API request/response types
- `models.ts` — Common domain models
- `utils.ts` — Utility types (Nullable, Optional, etc.)

## Example

```ts
// common.ts
export type ID = string
export type Timestamp = number
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// api.ts
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// utils.ts
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Maybe<T> = T | null | undefined
```

## Rules

- Export only types and interfaces
- Use `type` for unions/intersections
- Use `interface` for object shapes
- Generic types with descriptive parameters
