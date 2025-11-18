import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  THEME_MODES,
  resolveThemeVariant,
  getNextThemeMode,
  calculateNextSwitchTime,
  type ThemeMode,
} from '../lib'
import { createThemePersistence } from './persistence'
import { createSystemThemeObserver } from './observers/system'
import { createAutoThemeScheduler } from './observers/auto-scheduler'
import { applyThemeToDom } from './dom'

export const useThemeStore = defineStore('theme', () => {
  const currentMode = ref<ThemeMode>(THEME_MODES.SYSTEM)
  const systemPrefersDark = ref(false)

  const persistence = createThemePersistence()
  const systemObserver = createSystemThemeObserver((prefersDark) => {
    systemPrefersDark.value = prefersDark
  })
  const autoScheduler = createAutoThemeScheduler(() => {
    if (currentMode.value === THEME_MODES.AUTO) {
      currentMode.value = THEME_MODES.AUTO
    }
  }, calculateNextSwitchTime)

  const activeVariant = computed(() => {
    return resolveThemeVariant(currentMode.value, systemPrefersDark.value)
  })

  watch(
    activeVariant,
    (variant) => {
      applyThemeToDom(variant)
    },
    { immediate: true },
  )

  watch(currentMode, (newMode, oldMode) => {
    if (oldMode === THEME_MODES.AUTO && newMode !== THEME_MODES.AUTO) {
      autoScheduler.cleanup()
    }

    if (newMode === THEME_MODES.AUTO && oldMode !== THEME_MODES.AUTO) {
      autoScheduler.schedule()
    }
  })

  const init = (): void => {
    currentMode.value = persistence.load()
    systemObserver.init()

    if (currentMode.value === THEME_MODES.AUTO) {
      autoScheduler.schedule()
    }
  }

  const cleanup = (): void => {
    systemObserver.cleanup()
    autoScheduler.cleanup()
  }

  const setMode = (mode: ThemeMode): void => {
    currentMode.value = mode
    persistence.save(mode)
  }

  const cycleMode = (): void => {
    const nextMode = getNextThemeMode(currentMode.value)
    setMode(nextMode)
  }

  return {
    currentMode: computed(() => currentMode.value),
    activeVariant,
    init,
    cleanup,
    setMode,
    cycleMode,
  }
})
