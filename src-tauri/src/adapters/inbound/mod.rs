// Inbound Adapters - Entry points (Driving adapters)
//
// Implementations that handle external requests:
// - Tauri commands (organized by domain)
// - API handlers
// - Event listeners

pub mod commands;

// Re-export commands for easy registration
pub use commands::close_splashscreen;
