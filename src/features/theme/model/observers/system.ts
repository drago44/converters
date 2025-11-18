import { SYSTEM_THEME_QUERY } from '../../lib'

export type SystemThemeObserver = {
  init: () => void
  cleanup: () => void
  getCurrentPreference: () => boolean
}

export const createSystemThemeObserver = (
  onThemeChange: (prefersDark: boolean) => void,
): SystemThemeObserver => {
  let mediaQuery: MediaQueryList | null = null

  const handleChange = (event: MediaQueryListEvent): void => {
    onThemeChange(event.matches)
  }

  const init = (): void => {
    if (!window.matchMedia) return

    mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY)
    onThemeChange(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
  }

  const cleanup = (): void => {
    if (!mediaQuery) return
    mediaQuery.removeEventListener('change', handleChange)
    mediaQuery = null
  }

  const getCurrentPreference = (): boolean => {
    return mediaQuery?.matches ?? false
  }

  return { init, cleanup, getCurrentPreference }
}
