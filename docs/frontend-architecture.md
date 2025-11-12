# Frontend Architecture

## Methodology

**FSD (Feature-Sliced Design) + CQRS (Command Query Responsibility Segregation)**

- FSD — code organization by layers with clear dependency rules
- CQRS — separation of READ (queries) and WRITE (commands) operations

## Project Structure

```
src/
├── main.ts                 # Entry point
│
├── app/                    # 🔵 Application initialization
│   ├── App.vue             # Root component
│   ├── providers/          # Vue providers, Pinia, Router
│   ├── config/             # Global configuration
│   └── router/             # Vue Router setup
│
├── processes/              # 🟣 Cross-feature processes (optional)
│   └── [process-name]/
│       ├── model/          # Features orchestration
│       └── ui/             # Process UI
│
├── pages/                  # 🔴 Pages (routes)
│   └── [PageName]/
│       ├── ui/             # Page components
│       │   ├── PageName.vue
│       │   └── components/ # Local components
│       ├── model/          # Page logic
│       └── index.ts        # Public API
│
├── widgets/                # 🟠 Large UI blocks
│   └── [WidgetName]/
│       ├── ui/             # Widget UI
│       ├── model/          # Widget logic
│       └── index.ts
│
├── features/               # 🟢 Business functionality + CQRS
│   └── [feature-name]/
│       ├── queries/        # ✅ READ operations (status, data)
│       ├── commands/       # ✅ WRITE operations (actions, mutations)
│       ├── model/          # Types, state, logic
│       │   ├── types.ts
│       │   ├── store.ts
│       │   └── constants.ts
│       ├── ui/             # UI components for feature
│       └── index.ts        # Public API
│
├── entities/               # 🟡 Domain entities + CQRS
│   └── [entity-name]/
│       ├── queries/        # ✅ READ (get, list, search)
│       ├── commands/       # ✅ WRITE (create, update, delete)
│       ├── model/          # Types, schema, validation
│       │   ├── types.ts
│       │   ├── schema.ts
│       │   └── store.ts
│       ├── ui/             # UI for entity (Card, Avatar)
│       └── index.ts        # Public API
│
└── shared/                 # ⚪ Shared code
    ├── api/                # HTTP/Tauri clients, endpoints
    │   ├── http/
    │   └── tauri/
    ├── config/             # Constants, env variables
    ├── lib/                # Utilities, helpers
    │   ├── formatters/
    │   ├── validators/
    │   └── storage/
    ├── ui/                 # UI-kit (Button, Input, Modal)
    │   ├── Button/
    │   ├── Input/
    │   └── Modal/
    └── types/              # TypeScript types
        ├── common.ts
        ├── api.ts
        └── utils.ts
```

## FSD Layers (bottom-up)

### 1. ⚪ Shared — Shared code

**What:** Reusable code without business logic coupling
**Contains:** UI-kit, utilities, API clients, types
**Imports:** Only from other shared modules
**CQRS:** ❌ No

### 2. 🟡 Entities — Domain entities

**What:** CRUD operations for business entities
**Examples:** User, File, Project, Document
**Contains:** queries (read), commands (write), model, ui
**Imports:** shared, other entities (carefully)
**CQRS:** ✅ Yes (queries/ + commands/)

### 3. 🟢 Features — Business functionality

**What:** User scenarios and actions
**Examples:** Auth, FileUpload, Search, Notifications
**Contains:** queries (read), commands (write), model, ui
**Imports:** entities, shared
**CQRS:** ✅ Yes (queries/ + commands/)

### 4. 🟠 Widgets — Large UI blocks

**What:** Composition of features and entities
**Examples:** Header, Sidebar, Dashboard, UserProfile
**Contains:** ui, model
**Imports:** features, entities, shared
**CQRS:** ❌ No (uses queries/commands from features)

### 5. 🔴 Pages — Pages

**What:** Routes, widgets composition
**Examples:** HomePage, SettingsPage, ProfilePage
**Contains:** ui, model
**Imports:** widgets, features, entities, shared
**CQRS:** ❌ No (uses queries/commands from features)

### 6. 🟣 Processes — Orchestration (optional)

**What:** Complex cross-feature processes
**Examples:** Onboarding, Checkout, MultiStepWizard
**Contains:** model, ui
**Imports:** features, shared
**CQRS:** ❌ No (orchestrates features)

### 7. 🔵 App — Initialization

**What:** Entry point, providers, routing
**Contains:** App.vue, providers, config, router
**Imports:** All lower layers
**CQRS:** ❌ No

## Dependency Rules

```
app         →  pages, processes, widgets, features, entities, shared
processes   →  pages, features, shared
pages       →  widgets, features, entities, shared
widgets     →  features, entities, shared
features    →  entities, shared
entities    →  shared, other entities (carefully)
shared      →  only shared
```

### Forbidden

- ❌ Imports between features (`features/auth` → `features/notifications`)
- ❌ Imports between pages
- ❌ Imports from higher to lower layers
- ❌ Circular dependencies

## CQRS Structure

### Where used

✅ **Entities** — CRUD operations
✅ **Features** — Business logic

❌ **App, Pages, Widgets, Processes, Shared** — NOT used

### Queries (READ)

**Purpose:** Read data
**Properties:**
- Don't change state
- Cacheable
- Auto-execute (via watch)
- Readonly results

**Examples:**
- `entities/user/queries/useUser.ts` — get user
- `features/auth/queries/useAuthStatus.ts` — auth status

### Commands (WRITE)

**Purpose:** Change data
**Properties:**
- Change state
- Side-effects
- Manual execution
- Invalidate cache

**Examples:**
- `entities/user/commands/useCreateUser.ts` — create user
- `features/auth/commands/useLogin.ts` — login

## Slice Segments

### Segment
Folder inside slice for code organization.

**Standard segments:**
- `ui/` — UI components
- `model/` — types, state, logic
- `api/` — API requests (only for entities/features)
- `queries/` — read operations (CQRS)
- `commands/` — write operations (CQRS)
- `lib/` — utilities inside slice
- `config/` — slice configuration

### Entities structure

```
entities/[entity-name]/
  queries/              ← READ operations
  commands/             ← WRITE operations
  model/                ← Types, schema, store
  ui/                   ← UI components (Card, Avatar)
  index.ts              ← Public API
  README.md             ← Documentation
```

### Features structure

```
features/[feature-name]/
  queries/              ← READ operations
  commands/             ← WRITE operations
  model/                ← Types, state, logic
  ui/                   ← UI components for feature
  lib/                  ← Local utilities (optional)
  index.ts              ← Public API
  README.md             ← Documentation
```

### Pages structure

```
pages/[PageName]/
  ui/
    PageName.vue        ← Main component
    components/         ← Local components
  model/                ← Page logic (optional)
  index.ts              ← Public API
```

### Widgets structure

```
widgets/[WidgetName]/
  ui/
    WidgetName.vue      ← Main component
    components/         ← Local components
  model/                ← Widget logic
  index.ts              ← Public API
```

## Public API (index.ts)

Each slice exports only what's necessary via `index.ts`.

**Entities:**
```ts
export { useUser, useUsers } from './queries'
export { useCreateUser, useUpdateUser } from './commands'
export { default as UserCard } from './ui/UserCard.vue'
export type { User, CreateUserData } from './model/types'
```

**Features:**
```ts
export { useAuthStatus } from './queries'
export { useLogin, useLogout } from './commands'
export { default as LoginForm } from './ui/LoginForm.vue'
export type { LoginCredentials } from './model/types'
```

## Path aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

## Placement Examples

### User Management

```
entities/user/              # User CRUD
  queries/useUser.ts        # GET user
  commands/useCreateUser.ts # POST user

features/user-profile/      # Profile editing
  queries/useProfile.ts     # READ profile
  commands/useUpdateProfile.ts # UPDATE profile
  ui/ProfileForm.vue

pages/ProfilePage/          # Profile page
  ui/ProfilePage.vue        # Compose widgets/features
```

### Authentication

```
entities/user/              # User entity

features/auth/              # Authentication
  queries/useAuthStatus.ts  # Is authenticated?
  commands/useLogin.ts      # Login
  commands/useLogout.ts     # Logout
  ui/LoginForm.vue

widgets/HeaderWidget/       # Header with user menu
  ui/HeaderWidget.vue       # Uses features/auth

pages/LoginPage/            # Login page
  ui/LoginPage.vue          # Uses features/auth
```

### File Conversion

```
entities/file/              # Files CRUD
  queries/useFiles.ts
  commands/useUploadFile.ts

features/file-converter/    # Conversion
  queries/useConversionStatus.ts
  commands/useStartConversion.ts
  ui/ConverterWidget.vue

pages/ConverterPage/        # Converter page
  ui/ConverterPage.vue
```

## When to create new slice

### Entity — create when:

✅ Domain entity (User, File, Project)
✅ CRUD operations needed
✅ Used in multiple features
✅ Has clear data schema

### Feature — create when:

✅ Separate user scenario
✅ Can be used on different pages
✅ Has own UI and logic
✅ Doesn't depend on other features

### Widget — create when:

✅ Composition of multiple features
✅ Large complex UI block
✅ Used on multiple pages
✅ Has own composition logic

### Page — create when:

✅ Separate route in application
✅ Composition of widgets and features
✅ Has unique layout

## Checklist for new functionality

1. **Determine type:** Entity, Feature, Widget or Page?
2. **Determine layer:** entities, features, widgets, pages?
3. **Create structure:**
   - Entities/Features: queries/, commands/, model/, ui/
   - Widgets/Pages: ui/, model/
4. **Add Public API:** index.ts with exports
5. **Check dependencies:** imports only from lower layers
6. **Documentation:** README.md with description
