<script setup lang="ts">
import { computed, type Component } from 'vue'
import autoIcon from '@/shared/assets/icons/theme-auto.svg?component'
import darkIcon from '@/shared/assets/icons/theme-dark.svg?component'
import lightIcon from '@/shared/assets/icons/theme-light.svg?component'
import systemIcon from '@/shared/assets/icons/theme-system.svg?component'
import { useThemeStore } from '../model/store'
import { THEME_MODES, formatAutoThemeSwitchTimes, type ThemeMode, type ThemeVariant } from '../lib'

const theme = useThemeStore()

type ThemeConfig = {
  readonly iconSrc: Component
  readonly name: string
  readonly buildLabel: (variant: ThemeVariant) => string
}

const THEME_TOGGLE_CONFIG = {
  [THEME_MODES.SYSTEM]: {
    iconSrc: systemIcon,
    name: 'System',
    buildLabel: (variant: ThemeVariant) => `System: Follow OS preferences (currently ${variant})`,
  },
  [THEME_MODES.AUTO]: {
    iconSrc: autoIcon,
    name: 'Auto',
    buildLabel: (variant: ThemeVariant) =>
      `Auto: Switch at ${formatAutoThemeSwitchTimes()} (currently ${variant})`,
  },
  [THEME_MODES.LIGHT]: {
    iconSrc: lightIcon,
    name: 'Light',
    buildLabel: () => 'Light: Always use light theme',
  },
  [THEME_MODES.DARK]: {
    iconSrc: darkIcon,
    name: 'Dark',
    buildLabel: () => 'Dark: Always use dark theme',
  },
} as const satisfies Record<ThemeMode, ThemeConfig>

const config = computed(() => THEME_TOGGLE_CONFIG[theme.currentMode])
const iconSrc = computed(() => config.value.iconSrc)
const themeName = computed(() => config.value.name)
const label = computed(() => config.value.buildLabel(theme.activeVariant))
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :data-mode="theme.currentMode"
    :aria-label="label"
    :title="label"
    @click="theme.cycleMode"
  >
    <component :is="iconSrc" class="theme-toggle__icon" />
    <span class="theme-toggle__text">{{ themeName }}</span>
  </button>
</template>

<style scoped>
@reference '@/shared/styles/global.css';

.theme-toggle {
  @apply relative inline-flex h-11 cursor-pointer items-center justify-center gap-2 px-3;
  @apply rounded-xl border-2 border-transparent transition-all duration-200;
}

.theme-toggle:hover {
  @apply scale-105;
}

.theme-toggle:focus-visible {
  @apply outline-on-surface outline outline-2 outline-offset-2;
}

.theme-toggle:active {
  @apply scale-95;
}

.theme-toggle__icon {
  @apply h-6 w-6 transition-colors duration-200;
  stroke-width: 2;
}

.theme-toggle__text {
  @apply text-sm font-medium transition-colors duration-200;
}

/* Light theme - filled background */
:root[data-theme='light'] .theme-toggle[data-mode='system'] {
  @apply bg-amber-400;
}

:root[data-theme='light'] .theme-toggle[data-mode='system'] .theme-toggle__icon,
:root[data-theme='light'] .theme-toggle[data-mode='system'] .theme-toggle__text {
  @apply text-white;
}

:root[data-theme='light'] .theme-toggle[data-mode='auto'] {
  @apply bg-blue-400;
}

:root[data-theme='light'] .theme-toggle[data-mode='auto'] .theme-toggle__icon,
:root[data-theme='light'] .theme-toggle[data-mode='auto'] .theme-toggle__text {
  @apply text-white;
}

:root[data-theme='light'] .theme-toggle[data-mode='light'] {
  @apply bg-purple-400;
}

:root[data-theme='light'] .theme-toggle[data-mode='light'] .theme-toggle__icon,
:root[data-theme='light'] .theme-toggle[data-mode='light'] .theme-toggle__text {
  @apply text-white;
}

:root[data-theme='light'] .theme-toggle[data-mode='dark'] {
  @apply bg-green-400;
}

:root[data-theme='light'] .theme-toggle[data-mode='dark'] .theme-toggle__icon,
:root[data-theme='light'] .theme-toggle[data-mode='dark'] .theme-toggle__text {
  @apply text-white;
}

/* Dark theme - border only */
:root[data-theme='dark'] .theme-toggle[data-mode='system'] {
  @apply border-amber-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='system'] .theme-toggle__icon,
:root[data-theme='dark'] .theme-toggle[data-mode='system'] .theme-toggle__text {
  @apply text-amber-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='auto'] {
  @apply border-blue-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='auto'] .theme-toggle__icon,
:root[data-theme='dark'] .theme-toggle[data-mode='auto'] .theme-toggle__text {
  @apply text-blue-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='light'] {
  @apply border-purple-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='light'] .theme-toggle__icon,
:root[data-theme='dark'] .theme-toggle[data-mode='light'] .theme-toggle__text {
  @apply text-purple-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='dark'] {
  @apply border-green-400;
}

:root[data-theme='dark'] .theme-toggle[data-mode='dark'] .theme-toggle__icon,
:root[data-theme='dark'] .theme-toggle[data-mode='dark'] .theme-toggle__text {
  @apply text-green-400;
}
</style>
