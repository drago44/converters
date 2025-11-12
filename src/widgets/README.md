# Widgets Layer

**Purpose**: Large self-contained UI blocks that compose features and entities.

## Examples

- Header with navigation, user, search
- Sidebar with menu and filters
- Dashboard with analytics
- Form with validation and confirmation

## Typical widget structure

```
widgets/
  HeaderWidget/
    ui/
      HeaderWidget.vue
      components/
        UserMenu.vue
    model/
      useHeader.ts
    index.ts
```

## Rules

- Can contain multiple features
- Self-contained block with its own logic
- Reusable across different pages

## Dependencies

- Can use: features, entities, shared
- Cannot use: app, processes, pages, other widgets
