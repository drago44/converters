// Application Layer - Use cases and orchestration
//
// CQRS pattern:
// - commands: Write operations (state changes)
// - queries: Read operations (data retrieval)
//
// Also contains:
// - dto: Data Transfer Objects
// - services: Application services (buses, coordinators)

pub mod commands;
pub mod dto;
pub mod queries;
pub mod services;
