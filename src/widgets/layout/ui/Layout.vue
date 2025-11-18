<script setup lang="ts">
import Header from './Header.vue'
</script>

<template>
  <div class="layout">
    <Header class="layout__header" />
    <main class="layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
