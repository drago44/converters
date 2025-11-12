# Entities Layer

**Purpose**: Business entities, domain models, CRUD operations.

## CQRS Structure

Each entity uses CQRS pattern:

```
entities/
  user/
    queries/          # READ operations
      useUser.ts
      useUsers.ts
      useUserById.ts
    commands/         # WRITE operations
      useCreateUser.ts
      useUpdateUser.ts
      useDeleteUser.ts
    model/           # Types, schema, validation
      types.ts
      schema.ts
      userModel.ts
    ui/              # Reusable UI (UserCard, UserAvatar)
      UserCard.vue
      UserAvatar.vue
    index.ts
```

## Queries vs Commands

**Queries**:
- `useUser()` — get current user
- `useUsers()` — list of users
- `useUserById(id)` — user by ID
- Use cache, reactive refs

**Commands**:
- `useCreateUser()` — create user
- `useUpdateUser()` — update user
- `useDeleteUser()` — delete user
- Return command functions and execution state

## Rules

- One entity = one domain entity
- Contains CRUD operations through CQRS
- UI components only for displaying entity
- Does not contain features business logic

## Dependencies

- Can use: shared, other entities (carefully)
- Cannot use: app, processes, pages, widgets, features
