import type { ThemeMode, ThemeVariant } from './types'
import { AUTO_THEME_TIMES, THEME_MODE_CYCLE, THEME_MODES, THEME_VARIANTS } from './constants'

export const getAutoThemeVariant = (): ThemeVariant => {
  const currentHour = new Date().getHours()
  const isDark =
    currentHour >= AUTO_THEME_TIMES.DARK_START_HOUR ||
    currentHour < AUTO_THEME_TIMES.LIGHT_START_HOUR
  return isDark ? THEME_VARIANTS.DARK : THEME_VARIANTS.LIGHT
}

export const calculateNextSwitchTime = (): number => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentSecond = now.getSeconds()
  const currentMs = now.getMilliseconds()

  let targetHour: number

  if (currentHour < AUTO_THEME_TIMES.LIGHT_START_HOUR) {
    targetHour = AUTO_THEME_TIMES.LIGHT_START_HOUR
  } else if (currentHour < AUTO_THEME_TIMES.DARK_START_HOUR) {
    targetHour = AUTO_THEME_TIMES.DARK_START_HOUR
  } else {
    targetHour = AUTO_THEME_TIMES.LIGHT_START_HOUR + 24
  }

  const hoursUntil = targetHour - currentHour
  const minutesUntil = 60 - currentMinute
  const secondsUntil = 60 - currentSecond
  const msUntil = 1000 - currentMs

  return (
    (hoursUntil - 1) * 60 * 60 * 1000 +
    (minutesUntil - 1) * 60 * 1000 +
    (secondsUntil - 1) * 1000 +
    msUntil
  )
}

export const resolveThemeVariant = (
  mode: ThemeMode,
  systemPrefersDark: boolean,
): ThemeVariant => {
  const resolvers: Record<ThemeMode, () => ThemeVariant> = {
    [THEME_MODES.SYSTEM]: () =>
      systemPrefersDark ? THEME_VARIANTS.DARK : THEME_VARIANTS.LIGHT,
    [THEME_MODES.AUTO]: getAutoThemeVariant,
    [THEME_MODES.LIGHT]: () => THEME_VARIANTS.LIGHT,
    [THEME_MODES.DARK]: () => THEME_VARIANTS.DARK,
  }
  return resolvers[mode]()
}

export const getNextThemeMode = (currentMode: ThemeMode): ThemeMode => {
  const currentIndex = THEME_MODE_CYCLE.indexOf(currentMode)
  const nextIndex = (currentIndex + 1) % THEME_MODE_CYCLE.length
  return THEME_MODE_CYCLE[nextIndex]
}

/**
 * Formats auto theme switch times for display.
 * @returns Formatted time string like "8 AM/8 PM"
 */
export const formatAutoThemeSwitchTimes = (): string => {
  const lightHour = AUTO_THEME_TIMES.LIGHT_START_HOUR
  const darkHour = AUTO_THEME_TIMES.DARK_START_HOUR
  const darkHour12 = darkHour > 12 ? darkHour - 12 : darkHour
  return `${lightHour} AM/${darkHour12} PM`
}
