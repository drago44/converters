# Shared Layer

**Purpose**: Reusable code, utilities, UI-kit, API clients.

## Structure

- `api/` — HTTP clients, API endpoints, Tauri commands
- `config/` — Constants, env variables, global configuration
- `lib/` — Utilities, helpers, pure functions
- `ui/` — UI-kit (Button, Input, Modal, etc.)
- `types/` — Common TypeScript types and interfaces

## Examples

### api/
- `apiClient.ts` — Axios/fetch configuration
- `tauriCommands.ts` — Tauri invoke wrappers
- `endpoints.ts` — API URL constants

### config/
- `constants.ts` — Global constants
- `env.ts` — Environment variables

### lib/
- `formatDate.ts` — Date formatting
- `validation.ts` — Validators
- `storage.ts` — localStorage/sessionStorage helpers

### ui/
- `Button.vue`, `Input.vue`, `Modal.vue`
- UI components without business logic

### types/
- `common.ts` — Common types (ID, Timestamp, Status)
- `api.ts` — API request/response types

## Rules

- Code without business logic coupling
- Can be used in any layer
- Does not import from other layers (only from shared)
- Pure functions in lib/

## Dependencies

- Can use: only other modules from shared
- Cannot use: any other layers
