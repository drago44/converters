# Pages Layer

**Purpose**: Application pages, routes, composition of widgets and features.

## Typical page structure

```
pages/
  HomePage/
    ui/
      HomePage.vue
    model/
      useHomePage.ts
    index.ts
```

## Rules

- One page = one route
- Composition of widgets and features
- Minimum own logic (delegate to features)
- Responsible for page layout

## Dependencies

- Can use: widgets, features, entities, shared
- Cannot use: app, processes, other pages
