# App Config

**Purpose**: Global application configuration.

## What's here

- Environment variables
- Feature flags
- App metadata (version, name)
- Global settings

## Example

```ts
// config.ts
export const APP_CONFIG = {
  version: import.meta.env.VITE_APP_VERSION,
  apiUrl: import.meta.env.VITE_API_URL,
  isDev: import.meta.env.DEV,
} as const
```

## Rules

- Configuration only, no logic
- Uses env variables
- Readonly objects with `as const`
