# App Providers

**Purpose**: Vue providers, global composables, store setup.

## What's here

- Vue Router provider
- Pinia store setup
- Theme provider
- I18n provider
- Error boundary
- Auth provider

## Example

```ts
// withProviders.ts
export const withProviders = (app: App) => {
  app
    .use(router)
    .use(pinia)
    .use(i18n)
}
```

## Rules

- Provider initialization code
- Does not contain business logic
- Called from main.ts
