import { THEME_MODES, THEME_STORAGE_KEY, type ThemeMode } from '../lib'

export type ThemePersistence = {
  load: () => ThemeMode
  save: (mode: ThemeMode) => void
}

export const createThemePersistence = (): ThemePersistence => {
  const load = (): ThemeMode => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    const isValid = saved && Object.values(THEME_MODES).includes(saved as ThemeMode)
    return isValid ? (saved as ThemeMode) : THEME_MODES.SYSTEM
  }

  const save = (mode: ThemeMode): void => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  }

  return { load, save }
}
