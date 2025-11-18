import type { ThemeMode } from './types'

export const THEME_MODES = {
  SYSTEM: 'system',
  AUTO: 'auto',
  LIGHT: 'light',
  DARK: 'dark',
} as const satisfies Record<string, ThemeMode>

export const THEME_VARIANTS = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export const AUTO_THEME_TIMES = {
  LIGHT_START_HOUR: 8,
  DARK_START_HOUR: 20,
} as const

export const THEME_STORAGE_KEY = 'app-theme-mode' as const

export const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)' as const

/**
 * Theme mode cycle order for toggling between modes.
 * SYSTEM → AUTO → LIGHT → DARK → SYSTEM
 */
export const THEME_MODE_CYCLE = [
  THEME_MODES.SYSTEM,
  THEME_MODES.AUTO,
  THEME_MODES.LIGHT,
  THEME_MODES.DARK,
] as const
