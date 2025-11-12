// Ports Layer - Interface contracts (Hexagonal Architecture)
//
// Defines interfaces between layers:
// - inbound: External actors calling our application (API, UI)
// - outbound: External dependencies we need (DB, file system, services)

pub mod inbound;
pub mod outbound;
