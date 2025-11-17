// Tauri Commands - Inbound Adapter
//
// Handles frontend communication via Tauri invoke system.
// Organized by domain/feature rather than technology.

pub mod window;

// Re-export commands for easy registration
pub use window::close_splashscreen;
