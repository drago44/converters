export type AutoThemeScheduler = {
  schedule: () => void
  cleanup: () => void
}

export const createAutoThemeScheduler = (
  onSwitch: () => void,
  calculateNextSwitch: () => number,
): AutoThemeScheduler => {
  let timerId: number | null = null

  const cleanup = (): void => {
    if (timerId !== null) {
      window.clearTimeout(timerId)
      timerId = null
    }
  }

  const schedule = (): void => {
    cleanup()

    const msUntilSwitch = calculateNextSwitch()

    timerId = window.setTimeout(() => {
      onSwitch()
      schedule()
    }, msUntilSwitch)
  }

  return { schedule, cleanup }
}
