# Features Layer

**Purpose**: Business functionality, user scenarios, actions with entities.

## CQRS Structure

Each feature uses CQRS pattern:

```
features/
  auth/
    queries/          # READ operations (data fetching)
      useAuthStatus.ts
      useUserProfile.ts
    commands/         # WRITE operations (mutations, actions)
      useLogin.ts
      useLogout.ts
      useRegister.ts
    model/           # Types, state, business logic
      types.ts
      authStore.ts
    ui/              # UI components for feature
      LoginForm.vue
      RegisterForm.vue
    index.ts
```

## Queries vs Commands

**Queries** (reads):
- Read data
- Do not change state
- Cacheable
- Example: `useUserProfile()`, `useAuthStatus()`

**Commands** (writes):
- Change data
- Mutations, side-effects
- Invalidate cache
- Example: `useLogin()`, `useUpdateProfile()`

## Rules

- One feature = one user function
- Does not depend on other features
- Works with entities through queries/commands
- UI components are specific to this feature

## Dependencies

- Can use: entities, shared
- Cannot use: app, processes, pages, widgets, other features
