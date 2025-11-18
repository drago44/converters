<script setup lang="ts">
import { ThemeToggle } from '@/features/theme'
</script>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <img src="/tauri.svg" alt="Drago Forge" class="header__logo-img" />
        <span class="header__logo-text">Converters</span>
      </div>

      <nav class="header__nav">
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-outline);
  backdrop-filter: blur(8px);
}

.header__container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header__logo-img {
  width: 2rem;
  height: 2rem;
}

.header__logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-on-surface);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
