// Tauri Commands Adapter
//
// Handles frontend communication via Tauri invoke system.
// Maps Tauri commands to application use cases.

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
