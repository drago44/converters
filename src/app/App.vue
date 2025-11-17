<script setup lang="ts">
import { onMounted } from 'vue'
import { closeSplashScreen } from '@/shared/api/window'

onMounted(async () => {
  await closeSplashScreen()
})
</script>

<template>
  <RouterView />
</template>
