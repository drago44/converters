// Inbound Adapters - Entry points (Driving adapters)
//
// Implementations that handle external requests:
// - Tauri commands
// - API handlers
// - Event listeners

pub mod tauri;

// Re-export Tauri commands for easy access
pub use tauri::greet;
