# Backend Architecture

Rust/Tauri backend using **Hexagonal Architecture** + **CQRS** pattern.

## Structure

```
src/
├── main.rs                 # Entry point
├── lib.rs                  # Library root, layers setup
│
├── application/            # Application layer
│   ├── commands/           # CQRS write operations
│   ├── queries/            # CQRS read operations
│   ├── ports/              # Ports (interfaces)
│   └── services/           # Application services
│
├── domain/                 # Domain layer
│   ├── entities/           # Domain entities
│   ├── value_objects/      # Value objects
│   ├── aggregates/         # Aggregates
│   └── events/             # Domain events
│
├── infrastructure/         # Infrastructure layer
│   ├── adapters/           # Adapters (implementations)
│   │   ├── tauri/         # Tauri commands adapter
│   │   ├── persistence/   # Database adapter
│   │   └── file_system/   # File system adapter
│   ├── repositories/       # Repository implementations
│   └── config/             # Configuration
│
└── shared/                 # Shared utilities
    ├── errors/             # Error types
    └── utils/              # Utilities
```

## Architecture Layers

### Domain (Core)
- **Pure business logic** - no external dependencies
- **Entities** - domain objects with identity
- **Value Objects** - immutable domain objects
- **Aggregates** - consistency boundaries
- **Domain Events** - business events

### Application (Use Cases)
- **Commands** - write operations (CQRS)
- **Queries** - read operations (CQRS)
- **Ports** - interfaces (hexagonal architecture)
- **Services** - orchestration of domain logic

### Infrastructure (External)
- **Adapters** - implementations of ports
- **Tauri** - frontend communication
- **Persistence** - database operations
- **File System** - file operations
- **Repositories** - data access implementations

### Shared
- **Errors** - common error types
- **Utils** - utility functions

## CQRS Pattern

### Commands (Write)
- Change state
- Located in `application/commands/`
- Example: `CreateFileCommand`, `ConvertFileCommand`

### Queries (Read)
- Read state
- Located in `application/queries/`
- Example: `GetFileQuery`, `ListFilesQuery`

## Hexagonal Architecture

### Ports (Interfaces)
- Located in `application/ports/`
- Define contracts
- Example: `FileRepositoryPort`, `FileSystemPort`

### Adapters (Implementations)
- Located in `infrastructure/adapters/`
- Implement ports
- Example: `TauriAdapter`, `SqliteAdapter`, `LocalFileSystemAdapter`

## Dependencies Flow

```
domain  ← application ← infrastructure
  ↑                         ↑
  └─────── shared ──────────┘
```

- **Domain** - no dependencies (pure business logic)
- **Application** - depends on domain
- **Infrastructure** - depends on application and domain
- **Shared** - used by all layers

## Getting Started

See [docs/backend-architecture.md](../../docs/backend-architecture.md) for detailed guide.
