# App Layer

**Purpose**: Application initialization, global providers, routing, configuration.

## Structure

- `providers/` — Vue providers, store setup, global state
- `config/` — Application configuration (env, constants)
- `router/` — Vue Router setup and routes

## Rules

- Does not contain business logic
- Imports and composes lower layers (pages, features, entities, shared)
- Application entry point (main.ts is here or imports from here)

## Dependencies

- Can use: pages, processes, features, entities, shared
- Cannot use: nothing from higher layers (there are none)
