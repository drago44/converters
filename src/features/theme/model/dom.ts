import type { ThemeVariant } from '../lib'

export const applyThemeToDom = (variant: ThemeVariant): void => {
  document.documentElement.setAttribute('data-theme', variant)
}
