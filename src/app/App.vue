<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { closeSplashScreen } from '@/shared/api/window'
import { useThemeStore } from '@/features/theme'
import { Layout } from '@/widgets/layout'

const theme = useThemeStore()

onMounted(async () => {
  theme.init()
  await closeSplashScreen()
})

onUnmounted(() => {
  theme.cleanup()
})
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>
