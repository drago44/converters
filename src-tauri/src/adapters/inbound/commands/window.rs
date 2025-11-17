// Window Management Commands
//
// Handles window lifecycle and visibility operations.

use tauri::{AppHandle, Manager};

/// Closes splash screen and shows main application window.
/// Called after frontend initialization completes.
#[tauri::command]
pub async fn close_splashscreen(app: AppHandle) -> Result<(), String> {
    if let Some(splashscreen) = app.get_webview_window("splashscreen") {
        splashscreen.close().map_err(|e| e.to_string())?;
    }

    if let Some(main) = app.get_webview_window("main") {
        main.show().map_err(|e| e.to_string())?;
        main.set_focus().map_err(|e| e.to_string())?;
    }

    Ok(())
}
