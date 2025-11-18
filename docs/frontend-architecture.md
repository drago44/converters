# Frontend Architecture

## Methodology

**FSD (Feature-Sliced Design)**

FSD is a methodology for organizing frontend code by layers with clear dependency rules. This ensures maintainability, scalability, and predictable code structure.

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
├── features/               # 🟢 Business functionality
│   └── [feature-name]/
│       ├── lib/            # Pure functions, types, constants
│       ├── model/          # Store, state, side effects
│       │   ├── store.ts
│       │   └── persistence.ts
│       ├── ui/             # UI components
│       ├── api/            # Tauri/HTTP calls (optional)
│       └── index.ts        # Public API
│
├── entities/               # 🟡 Domain entities
│   └── [entity-name]/
│       ├── api/            # Backend communication
│       ├── model/          # Types, schema, store
│       │   ├── types.ts
│       │   ├── schema.ts
│       │   └── store.ts
│       ├── ui/             # UI components (Card, Avatar)
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

### 2. 🟡 Entities — Domain entities

**What:** Business entities with CRUD operations
**Examples:** User, File, Project, Document
**Contains:** api, model, ui, lib
**Imports:** shared, other entities (carefully)

### 3. 🟢 Features — Business functionality

**What:** User scenarios and actions
**Examples:** Auth, FileUpload, Search, Notifications, Theme
**Contains:** lib, model, ui, api (optional)
**Imports:** entities, shared

### 4. 🟠 Widgets — Large UI blocks

**What:** Composition of features and entities
**Examples:** Header, Sidebar, Dashboard, UserProfile
**Contains:** ui, model
**Imports:** features, entities, shared

### 5. 🔴 Pages — Pages

**What:** Routes, widgets composition
**Examples:** HomePage, SettingsPage, ProfilePage
**Contains:** ui, model
**Imports:** widgets, features, entities, shared

### 6. 🟣 Processes — Orchestration (optional)

**What:** Complex cross-feature processes
**Examples:** Onboarding, Checkout, MultiStepWizard
**Contains:** model, ui
**Imports:** features, shared

### 7. 🔵 App — Initialization

**What:** Entry point, providers, routing
**Contains:** App.vue, providers, config, router
**Imports:** All lower layers

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

## Slice Segments

### What is a Segment?

Segment is a folder inside a slice that organizes code by **technical purpose** (the WHY), not by essence (the WHAT).

**Core principle:** Segment names MUST describe purpose, NOT type.

---

### Standard Segments

#### 1. `ui/` — User Interface

**Purpose:** Everything related to visual presentation

**Contains:**
- Vue components (`.vue` files)
- Component-specific styles
- Visual presentation logic

**When to use:** Always for components that render UI

**Available in:** All layers

**Examples:**
```
features/auth/ui/LoginForm.vue
entities/user/ui/UserCard.vue
shared/ui/Button/Button.vue
```

---

#### 2. `model/` — Business Logic & State

**Purpose:** Data structures, state management, business logic

**Contains:**
- Types and interfaces
- Schemas and validation
- Stores (Pinia)
- Business logic functions
- Stateful logic (observers, persistence, DOM manipulation)

**When to use:**
- Types for business entities
- State management
- Side effects (localStorage, DOM, timers)

**Available in:** All layers except `app/`

**Examples:**
```
features/theme/model/
  ├── store.ts           — Pinia store
  ├── persistence.ts     — localStorage logic
  ├── dom.ts            — DOM manipulation
  └── observers/        — MediaQuery, timers
```

**Key insight:** `model/` contains stateful logic with side effects

---

#### 3. `lib/` — Utilities

**Purpose:** Pure helper functions and constants specific to this slice

**Contains:**
- Pure functions (no side effects)
- Slice-specific utilities
- Type definitions
- Constants and enums

**When to use:**
- Pure calculations and transformations
- Feature-specific utilities

**Available in:** All layers

**Critical distinction:**
- `features/[name]/lib/` — Feature-specific logic
- `shared/lib/` — Generic, reusable utilities

**Examples:**
```
features/theme/lib/
  ├── types.ts          — ThemeMode, ThemeVariant types
  ├── constants.ts      — THEME_MODES, THEME_VARIANTS
  └── utils.ts          — resolveThemeVariant, getNextThemeMode

shared/lib/
  ├── formatters/formatDate.ts — Generic date formatter
  └── validators/email.ts      — Email validator
```

---

#### 4. `api/` — Backend Communication

**Purpose:** Communication with backend or external services

**Contains:**
- Request functions (HTTP, Tauri invoke)
- DTOs (Data Transfer Objects)
- Response mappers
- API client configurations

**When to use:**
- Backend API calls
- Tauri command wrappers

**Available in:** `entities/`, `features/`, `shared/` ONLY

**Examples:**
```
shared/api/
  ├── window/
  │   ├── lifecycle.ts  — closeSplashScreen()
  │   └── index.ts      — Re-export
  └── http/
      └── client.ts     — Axios instance
```

---

#### 5. `config/` — Configuration

**Purpose:** Configuration files and constants

**Contains:**
- Feature flags
- Slice-specific constants
- Configuration objects

**When to use:** Configuration that doesn't fit in `lib/`

**Available in:** All layers

---

### Forbidden Segment Names

**Never use these names** (they describe WHAT, not WHY):

| ❌ Forbidden | ✅ Use instead |
|-------------|---------------|
| `components/` | `ui/` |
| `hooks/` | `model/` (for composables) or `lib/` (for utilities) |
| `types/` | `model/` or `lib/` |
| `utils/` | `lib/` |
| `helpers/` | `lib/` |
| `composables/` | `model/` (for stateful) or `lib/` (for pure functions) |

---

### Segments by Layer

| Layer | Allowed Segments |
|-------|-----------------|
| `app/` | No slices, only `providers/`, `config/`, `router/` |
| `pages/` | `ui/`, `model/` |
| `widgets/` | `ui/`, `model/` |
| `features/` | `model/`, `ui/`, `lib/`, `api/` (optional), `config/` (optional) |
| `entities/` | `model/`, `ui/`, `api/`, `lib/`, `config/` (optional) |
| `shared/` | No slices, only `api/`, `config/`, `lib/`, `ui/` |

---

### Segment Decision Tree

Use this decision tree to determine which segment to use:

```
What are you adding?
│
├─ Is it a UI component?
│  └─→ ui/
│
├─ Is it backend communication?
│  ├─ HTTP/Tauri invoke? → api/
│  └─ Only in: entities/, features/, shared/
│
├─ Is it state or business logic?
│  ├─ Has side effects? (store, DOM, localStorage, timers)
│  │  └─→ model/
│  ├─ Pure function/constant?
│  │  ├─ Feature-specific? → features/[name]/lib/
│  │  └─ Generic utility? → shared/lib/
│  └─ Types?
│     ├─ Business entity? → model/types.ts
│     ├─ API DTO? → api/types.ts
│     └─ Feature-specific? → lib/types.ts
│
└─ Is it configuration?
   └─→ config/
```

**Quick reference:**

| Question | Answer → Segment |
|----------|-----------------|
| Renders UI? | `ui/` |
| Calls backend? | `api/` (entities/features/shared only) |
| Has side effects? | `model/` |
| Pure function? | `lib/` (feature-specific) or `shared/lib/` (generic) |
| Configuration? | `config/` |

**Common mistakes:**

| Mistake | Correct placement |
|---------|------------------|
| Theme constants in `shared/lib/` | `features/theme/lib/constants.ts` |
| `formatDate()` in `features/[x]/lib/` | `shared/lib/formatters/formatDate.ts` |
| Store in `lib/` | `model/store.ts` |
| Types in separate `types/` folder | Colocate with usage (`model/`, `lib/`, `api/`) |

---

### Entities structure

```
entities/[entity-name]/
  api/                  ← Backend communication (Tauri invoke, HTTP)
  model/                ← Types, schema, store, business logic
  ui/                   ← UI components (Card, Avatar)
  lib/                  ← Pure utilities (optional)
  index.ts              ← Public API
  README.md             ← Documentation (optional)
```

### Features structure

```
features/[feature-name]/
  lib/                  ← Pure functions, types, constants
  model/                ← Store, state, side effects
  ui/                   ← UI components
  api/                  ← Tauri/HTTP calls (optional)
  config/               ← Configuration (optional)
  index.ts              ← Public API
  README.md             ← Documentation (optional)
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
// Export API functions
export { getUser, getUsers, createUser, updateUser } from './api'

// Export UI components
export { default as UserCard } from './ui/UserCard.vue'

// Export types
export type { User, CreateUserData } from './model/types'
```

**Features:**
```ts
// Export store (if using Pinia)
export { useThemeStore } from './model/store'

// Export UI components
export { default as ThemeToggle } from './ui/ThemeToggle.vue'

// Export types
export type { ThemeMode, ThemeVariant } from './lib/types'
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
entities/user/              # User entity
  api/
    getUser.ts              # GET /users/:id
    getUsers.ts             # GET /users
    createUser.ts           # POST /users
  model/
    types.ts                # User type
    store.ts                # User state
  ui/
    UserCard.vue            # User card component

features/user-profile/      # Profile editing
  model/
    store.ts                # Profile store
  ui/
    ProfileForm.vue         # Profile form

pages/ProfilePage/          # Profile page
  ui/
    ProfilePage.vue         # Compose widgets/features
```

### Authentication (Tauri example)

```
entities/user/              # User entity
  model/
    types.ts
    store.ts

features/auth/              # Authentication
  api/
    login.ts                # invoke('login')
    logout.ts               # invoke('logout')
    checkStatus.ts          # invoke('auth_status')
  model/
    store.ts                # Auth state
  ui/
    LoginForm.vue

widgets/header/             # Header with user menu
  ui/
    Header.vue              # Uses features/auth

pages/login/                # Login page
  ui/
    LoginPage.vue           # Uses features/auth
```

### Theme Management (Real example from this project)

```
features/theme/             # Theme feature
  lib/
    types.ts                # ThemeMode, ThemeVariant
    constants.ts            # THEME_MODES, THEME_VARIANTS
    utils.ts                # resolveThemeVariant, getNextThemeMode
  model/
    store.ts                # useThemeStore()
    persistence.ts          # localStorage wrapper
    dom.ts                  # applyThemeToDom()
    observers/
      system.ts             # MediaQuery observer
      auto-scheduler.ts     # Timer-based scheduler
  ui/
    ThemeToggle.vue         # Toggle button

widgets/layout/             # Layout widget
  ui/
    Header.vue              # Uses ThemeToggle

app/App.vue                 # Initializes theme.init()
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
   - Entities: api/, model/, ui/, lib/ (optional)
   - Features: lib/, model/, ui/, api/ (optional)
   - Widgets/Pages: ui/, model/ (optional)
4. **Add Public API:** index.ts with exports
5. **Check dependencies:** imports only from lower layers
6. **Documentation:** README.md (optional)
