# App Router

**Purpose**: Vue Router configuration and routes.

## What's here

- Route declarations
- Navigation guards
- Route middleware
- Router instance

## Example structure

```
router/
  routes/
    index.ts          # Export all routes
    homeRoutes.ts     # Routes for home pages
    authRoutes.ts     # Routes for auth pages
  guards/
    authGuard.ts      # Auth check
  index.ts            # Router instance
```

## Rules

- Lazy load pages via `() => import()`
- Guards don't contain business logic (delegate to features)
- Type routes with TypeScript
