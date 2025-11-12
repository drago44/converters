// Hexagonal Architecture + CQRS + DDD for Tauri Backend
//
// Architecture layers (onion architecture):
// 1. domain: Pure business logic (entities, value objects, aggregates, domain events)
//    - conversion: File conversion bounded context
//    - storage: File storage bounded context
//    - shared: Shared domain primitives
//
// 2. application: Use cases and orchestration (CQRS)
//    - commands: WRITE operations
//    - queries: READ operations
//    - dto: Data Transfer Objects
//    - services: Application coordination (buses)
//
// 3. ports: Interface contracts (Hexagonal Architecture)
//    - inbound: Who calls us (driving adapters)
//    - outbound: What we need (driven adapters)
//
// 4. adapters: Port implementations
//    - inbound: Entry points (Tauri commands, API)
//    - outbound: External integrations (DB, file system)
//
// 5. infrastructure: Technical infrastructure
//    - config: Configuration, DI
//    - bus: Command/Query buses
//    - logging: Structured logging
//
// 6. shared: Common utilities
//    - errors: Error types
//    - utils: Pure functions
//
// Dependency Rule: infrastructure → adapters → ports → application → domain → shared

mod adapters;
mod application;
mod domain;
mod infrastructure;
mod ports;
mod shared;

use adapters::inbound::greet;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
