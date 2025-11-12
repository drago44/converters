# Shared Config

**Purpose**: Constants, settings, env variables.

## What's here

- Global constants (MAX_FILE_SIZE, TIMEOUT, etc.)
- Environment variables
- Feature flags
- Default values

## Example

```ts
// constants.ts
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const REQUEST_TIMEOUT = 30000 // 30s

export const STATUS_MAP = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
} as const

// env.ts
export const ENV = {
  apiUrl: import.meta.env.VITE_API_URL,
  isDev: import.meta.env.DEV,
} as const
```

## Rules

- SCREAMING_SNAKE_CASE for constants
- `as const` for readonly objects
- No logic, only values
