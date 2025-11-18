import { invoke } from '@tauri-apps/api/core'

/**
 * Hides splash screen and shows main window.
 * Should be called after app initialization completes.
 */
export const closeSplashScreen = async (): Promise<void> => {
  await invoke('close_splashscreen')
}
