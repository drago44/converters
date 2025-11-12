# Shared Lib

**Purpose**: Utilities, helpers, pure functions.

## Categories

- `formatters/` — Formatting (dates, numbers, currency)
- `validators/` — Validation (email, phone, etc.)
- `parsers/` — Data parsing
- `storage/` — localStorage/sessionStorage helpers
- `guards/` — Type guards and assertions

## Example

```ts
// formatters/date.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US')
}

// validators/email.ts
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// guards/typeGuards.ts
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}
```

## Rules

- Pure functions only (no side-effects)
- Covered with unit tests
- No business logic dependencies
- TypeScript strict mode
