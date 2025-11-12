// Adapters Layer - Port implementations (Hexagonal Architecture)
//
// Concrete implementations of port interfaces:
// - inbound: Entry points (Tauri commands, API handlers)
// - outbound: External integrations (DB, file system, services)

pub mod inbound;
pub mod outbound;
