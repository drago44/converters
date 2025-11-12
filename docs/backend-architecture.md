# Backend Architecture

## Methodology

**Hexagonal Architecture (Ports & Adapters) + CQRS (Command Query Responsibility Segregation)**

- Hexagonal Architecture — isolation of business logic from external dependencies
- CQRS — separation of READ (queries) and WRITE (commands) operations
- Clean Architecture principles — dependency inversion, domain-centric design

## Project Structure

```
src-tauri/src/
├── main.rs                     # Entry point
├── lib.rs                      # Library initialization, DI setup
│
├── domain/                     # [DOMAIN] Domain layer (business logic)
│   ├── entities/               # Entities with identity
│   │   └── [entity_name]/
│   │       ├── mod.rs
│   │       └── tests.rs
│   ├── value_objects/          # Immutable value objects
│   │   └── [value_name]/
│   ├── aggregates/             # Consistency boundaries
│   │   └── [aggregate_name]/
│   ├── events/                 # Domain events
│   │   └── [event_name].rs
│   └── mod.rs
│
├── application/                # [APPLICATION] Application layer (use cases)
│   ├── commands/               # [WRITE] WRITE operations
│   │   └── [domain]/
│   │       ├── create_[entity].rs
│   │       ├── update_[entity].rs
│   │       ├── delete_[entity].rs
│   │       └── mod.rs
│   ├── queries/                # [READ] READ operations
│   │   └── [domain]/
│   │       ├── get_[entity].rs
│   │       ├── list_[entities].rs
│   │       └── mod.rs
│   ├── services/               # Application services
│   │   └── [service_name].rs
│   ├── dto/                    # Data Transfer Objects
│   │   └── [dto_name].rs
│   └── mod.rs
│
├── ports/                      # [PORTS] Ports (interfaces)
│   ├── inbound/                # Primary ports (driven by app)
│   │   └── [use_case].rs
│   ├── outbound/               # Secondary ports (driven by infra)
│   │   ├── [repository]_port.rs
│   │   ├── [service]_port.rs
│   │   └── mod.rs
│   └── mod.rs
│
├── adapters/                   # [ADAPTERS] Adapters (implementations)
│   ├── inbound/                # Primary adapters
│   │   └── tauri/              # Tauri commands
│   │       ├── [domain]/
│   │       │   ├── commands.rs
│   │       │   └── mod.rs
│   │       └── mod.rs
│   ├── outbound/               # Secondary adapters
│   │   ├── persistence/        # Database adapters
│   │   │   ├── sqlite/
│   │   │   └── mod.rs
│   │   ├── file_system/        # File system adapters
│   │   │   ├── local_fs.rs
│   │   │   └── mod.rs
│   │   └── mod.rs
│   └── mod.rs
│
├── infrastructure/             # [INFRA] Infrastructure layer
│   ├── config/                 # Configuration
│   │   ├── app_config.rs
│   │   ├── database.rs
│   │   └── mod.rs
│   ├── repositories/           # Repository implementations
│   │   └── [entity]_repository.rs
│   ├── di/                     # Dependency Injection
│   │   └── container.rs
│   └── mod.rs
│
└── shared/                     # [SHARED] Shared utilities
    ├── errors/                 # Error types
    │   ├── domain_error.rs
    │   ├── app_error.rs
    │   └── mod.rs
    ├── utils/                  # Utility functions
    │   ├── validators.rs
    │   ├── converters.rs
    │   └── mod.rs
    └── mod.rs
```

## Architecture Layers (center-out)

### 1. Domain — Business Logic Core

**What:** Pure business logic, framework-agnostic
**Contains:** Entities, Value Objects, Aggregates, Domain Events
**Dependencies:** None (zero external dependencies)
**CQRS:** No (domain models only)

**Rules:**
- No external crates (except std, serde for serialization)
- No I/O operations
- Pure functions and immutable data structures
- Business rules validation

**Example:**
```rust
// domain/entities/file/mod.rs
pub struct File {
    id: FileId,
    name: FileName,
    size: FileSize,
    format: FileFormat,
    status: FileStatus,
}

impl File {
    pub fn convert_to(&self, target_format: FileFormat) -> Result<Self, DomainError> {
        // Business logic validation
        if !self.status.can_convert() {
            return Err(DomainError::InvalidState);
        }
        // ...
    }
}
```

### 2. Application — Use Cases

**What:** Orchestration of domain logic, application services
**Contains:** Commands (write), Queries (read), Services, DTOs
**Dependencies:** domain, shared
**CQRS:** Yes (commands/ + queries/)

**Rules:**
- Orchestrates domain entities
- No direct I/O (uses ports)
- Transaction boundaries
- Validation and error handling

**Example:**
```rust
// application/commands/conversion/convert_file.rs
pub struct ConvertFileCommand {
    file_id: String,
    target_format: String,
}

pub async fn execute(
    cmd: ConvertFileCommand,
    file_repo: &dyn FileRepositoryPort,
    converter: &dyn ConverterPort,
) -> Result<FileDto, AppError> {
    // Use case logic
}
```

### 3. Ports — Interfaces (Contracts)

**What:** Trait definitions for dependencies
**Contains:** Inbound ports (use cases), Outbound ports (repositories, services)
**Dependencies:** domain, shared
**CQRS:** No

**Rules:**
- Define contracts only
- No implementations
- Used by application layer
- Implemented by adapters

**Example:**
```rust
// ports/outbound/file_repository_port.rs
#[async_trait]
pub trait FileRepositoryPort: Send + Sync {
    async fn find_by_id(&self, id: &str) -> Result<Option<File>, RepoError>;
    async fn save(&self, file: &File) -> Result<(), RepoError>;
}
```

### 4. Adapters — Implementations

**What:** Concrete implementations of ports
**Contains:** Inbound (Tauri, CLI), Outbound (DB, FS, HTTP)
**Dependencies:** application, domain, ports, shared
**CQRS:** No (implements ports)

**Inbound Adapters:**
- Tauri commands (frontend <-> backend)
- CLI interface
- gRPC/REST API (future)

**Outbound Adapters:**
- Database (SQLite, Postgres)
- File System
- External APIs

**Example:**
```rust
// adapters/inbound/tauri/conversion/commands.rs
#[tauri::command]
pub async fn convert_file(
    file_id: String,
    target_format: String,
    state: State<'_, AppState>,
) -> Result<FileDto, String> {
    let cmd = ConvertFileCommand { file_id, target_format };
    execute(cmd, &state.file_repo, &state.converter)
        .await
        .map_err(|e| e.to_string())
}
```

### 5. Infrastructure — External Concerns

**What:** Configuration, DI, cross-cutting concerns
**Contains:** Config, Repositories, DI Container
**Dependencies:** All layers
**CQRS:** No

**Rules:**
- Database migrations
- Configuration management
- Dependency injection setup
- Logging, monitoring

### 6. Shared — Common Utilities

**What:** Reusable code across all layers
**Contains:** Errors, Utils, Types
**Dependencies:** None (self-contained)
**CQRS:** No

## Dependency Rules

```
                    ┌─────────────┐
                    │   Domain    │ (core)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Application │ (use cases)
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐      ┌─────▼─────┐    ┌─────▼──────┐
    │  Ports  │      │  Adapters │    │Infrastructure│
    └─────────┘      └───────────┘    └────────────┘
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Shared    │
                    └─────────────┘
```

### Allowed Dependencies

```
infrastructure  →  adapters, ports, application, domain, shared
adapters        →  ports, application, domain, shared
ports           →  domain, shared
application     →  domain, shared
domain          →  (none)
shared          →  (none)
```

### Forbidden

- Domain → Application/Infrastructure/Ports
- Application → Adapters/Infrastructure
- Circular dependencies
- Direct dependencies between adapters
- Shared → Any layer

## CQRS Structure

### Where used

**Application layer** — Commands (write), Queries (read)
**Ports** — Command/Query handlers as traits

**NOT used:** Domain, Adapters, Infrastructure, Shared

### Commands (WRITE)

**Purpose:** Change state, perform actions
**Location:** `application/commands/[domain]/`

**Properties:**
- Mutate state
- Side-effects allowed
- Return minimal data (ID, success)
- Transaction boundaries
- Validation before execution

**Structure:**
```rust
// application/commands/conversion/convert_file.rs
pub struct ConvertFileCommand {
    pub file_id: String,
    pub target_format: String,
}

pub async fn execute(
    cmd: ConvertFileCommand,
    file_repo: &dyn FileRepositoryPort,
    converter: &dyn ConverterPort,
) -> Result<String, AppError> {
    // 1. Validate input
    // 2. Load domain entity
    // 3. Execute business logic
    // 4. Persist changes
    // 5. Return result
}
```

**Examples:**
- `CreateFileCommand` — create new file
- `ConvertFileCommand` — convert file
- `DeleteFileCommand` — delete file

### Queries (READ)

**Purpose:** Read data, no state changes
**Location:** `application/queries/[domain]/`

**Properties:**
- No mutations
- No side-effects
- Return DTOs (not domain entities)
- Cacheable
- Optimized for reading

**Structure:**
```rust
// application/queries/conversion/get_file.rs
pub struct GetFileQuery {
    pub file_id: String,
}

pub async fn execute(
    query: GetFileQuery,
    file_repo: &dyn FileRepositoryPort,
) -> Result<FileDto, AppError> {
    // 1. Load from repository
    // 2. Map to DTO
    // 3. Return
}
```

**Examples:**
- `GetFileQuery` — get single file
- `ListFilesQuery` — list all files
- `GetConversionStatusQuery` — check conversion status

## Module Organization

### Domain Module

```rust
// domain/entities/file/mod.rs
pub struct File { /* ... */ }

// domain/value_objects/file_name.rs
pub struct FileName(String);

// domain/aggregates/conversion_job/mod.rs
pub struct ConversionJob {
    file: File,
    target_format: FileFormat,
    // ...
}
```

### Application Module

```rust
// application/commands/mod.rs
pub mod conversion;
pub mod storage;

// application/queries/mod.rs
pub mod conversion;
pub mod storage;

// application/dto/mod.rs
pub mod file_dto;
pub mod conversion_dto;
```

### Ports Module

```rust
// ports/outbound/mod.rs
pub trait FileRepositoryPort { /* ... */ }
pub trait ConverterPort { /* ... */ }
pub trait FileSystemPort { /* ... */ }
```

### Adapters Module

```rust
// adapters/inbound/tauri/mod.rs
pub mod conversion;
pub mod storage;

// adapters/outbound/persistence/mod.rs
pub mod sqlite;

// adapters/outbound/file_system/mod.rs
pub mod local_fs;
```

## Public API (mod.rs)

Each module exports only necessary items:

**Domain:**
```rust
// domain/mod.rs
pub mod entities;
pub mod value_objects;
pub mod aggregates;

pub use entities::file::File;
pub use value_objects::FileName;
```

**Application:**
```rust
// application/mod.rs
pub mod commands;
pub mod queries;
pub mod dto;

pub use commands::conversion::convert_file;
pub use queries::conversion::get_file;
```

**Ports:**
```rust
// ports/mod.rs
pub mod outbound;

pub use outbound::{FileRepositoryPort, ConverterPort};
```

## Dependency Injection

### Container Setup

```rust
// infrastructure/di/container.rs
pub struct AppContainer {
    pub file_repo: Arc<dyn FileRepositoryPort>,
    pub converter: Arc<dyn ConverterPort>,
    pub fs: Arc<dyn FileSystemPort>,
}

impl AppContainer {
    pub fn new(config: &AppConfig) -> Self {
        Self {
            file_repo: Arc::new(SqliteFileRepository::new(&config.db)),
            converter: Arc::new(ImageConverter::new()),
            fs: Arc::new(LocalFileSystem::new()),
        }
    }
}
```

### Tauri State

```rust
// lib.rs
pub struct AppState {
    pub container: AppContainer,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let config = AppConfig::load();
    let container = AppContainer::new(&config);

    tauri::Builder::default()
        .manage(AppState { container })
        .invoke_handler(tauri::generate_handler![
            adapters::inbound::tauri::conversion::convert_file,
            adapters::inbound::tauri::storage::list_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Error Handling Strategy

### Error Types Hierarchy

```rust
// shared/errors/mod.rs

// Domain errors (business logic violations)
#[derive(Debug, thiserror::Error)]
pub enum DomainError {
    #[error("Invalid state: {0}")]
    InvalidState(String),
    #[error("Validation failed: {0}")]
    ValidationFailed(String),
}

// Application errors (use case failures)
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Domain error: {0}")]
    Domain(#[from] DomainError),
    #[error("Repository error: {0}")]
    Repository(String),
    #[error("Not found: {0}")]
    NotFound(String),
}

// Infrastructure errors (technical failures)
#[derive(Debug, thiserror::Error)]
pub enum InfraError {
    #[error("Database error: {0}")]
    Database(String),
    #[error("File system error: {0}")]
    FileSystem(String),
}
```

### Error Conversion

```rust
impl From<InfraError> for AppError {
    fn from(err: InfraError) -> Self {
        match err {
            InfraError::Database(msg) => AppError::Repository(msg),
            InfraError::FileSystem(msg) => AppError::Repository(msg),
        }
    }
}
```

## Testing Strategy

### Unit Tests (Domain)

```rust
// domain/entities/file/tests.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_file_conversion_validation() {
        let file = File::new(...);
        let result = file.convert_to(FileFormat::Png);
        assert!(result.is_ok());
    }
}
```

### Integration Tests (Application)

```rust
// tests/integration/commands/convert_file_test.rs
#[tokio::test]
async fn test_convert_file_command() {
    let mock_repo = MockFileRepository::new();
    let cmd = ConvertFileCommand { ... };

    let result = execute(cmd, &mock_repo, &mock_converter).await;

    assert!(result.is_ok());
}
```

### E2E Tests (Adapters)

```rust
// tests/e2e/tauri_commands_test.rs
#[tokio::test]
async fn test_tauri_convert_file() {
    let app = test_app();
    let response = app.call("convert_file", json!({ ... })).await;

    assert!(response.is_ok());
}
```

## Placement Examples

### File Conversion Feature

```
domain/entities/file/                 # File entity
domain/value_objects/file_format.rs   # FileFormat enum
domain/aggregates/conversion_job/     # Conversion aggregate

application/commands/conversion/
  convert_file.rs                     # Convert file command

application/queries/conversion/
  get_conversion_status.rs            # Get status query

ports/outbound/
  file_repository_port.rs             # File repo interface
  converter_port.rs                   # Converter interface

adapters/inbound/tauri/conversion/
  commands.rs                         # Tauri commands

adapters/outbound/persistence/
  sqlite/file_repository.rs           # SQLite implementation

infrastructure/repositories/
  file_repository.rs                  # Repository setup
```

### Storage Management

```
domain/entities/storage/              # Storage entity

application/commands/storage/
  create_storage.rs                   # Create storage

application/queries/storage/
  list_storages.rs                    # List storages

adapters/inbound/tauri/storage/
  commands.rs                         # Storage commands

adapters/outbound/file_system/
  local_fs.rs                         # Local FS adapter
```

## When to Create New Module

### Entity — create when:

- Has business identity (ID)
- Has lifecycle (creation, changes, deletion)
- Contains business logic
- Referenced by other entities

### Value Object — create when:

- Immutable
- No identity (equality by value)
- Validated on creation
- Used across entities

### Aggregate — create when:

- Consistency boundary needed
- Group of entities + value objects
- Has aggregate root
- Enforces invariants

### Command — create when:

- State change required
- Side-effects needed
- Business action
- Validation before execution

### Query — create when:

- Read-only operation
- No state changes
- Returns DTO
- Optimized for UI

## Checklist for New Feature

1. **Domain first:**
   - Define entity/value object/aggregate
   - Write business logic
   - Add unit tests

2. **Application layer:**
   - Create command/query
   - Define DTOs
   - Write integration tests

3. **Ports:**
   - Define repository port
   - Define service port (if needed)

4. **Adapters:**
   - Implement Tauri commands (inbound)
   - Implement repository (outbound)
   - Write E2E tests

5. **Infrastructure:**
   - Setup DI bindings
   - Add to Tauri invoke handler
   - Configure database (if needed)

6. **Documentation:**
   - Update this file
   - Add inline comments (why, not what)

## Best Practices

### Domain Layer
- Pure functions, no I/O
- Rich domain models (not anemic)
- Value objects for validation
- Domain events for side-effects
- No framework dependencies

### Application Layer
- Thin orchestration layer
- Use ports for dependencies
- Transaction boundaries
- DTOs for data transfer
- No direct I/O operations

### Ports
- Small, focused interfaces
- Async by default
- Return Results
- No implementations

### Adapters
- Single responsibility
- Error mapping
- Logging at boundaries
- No business logic

### Infrastructure
- Configuration externalized
- Environment-based setup
- Connection pooling
- No business logic

## References

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
