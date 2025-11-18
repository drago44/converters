import type { App } from 'vue'
import { createPinia } from 'pinia'
import router from '@/app/router'

export const withProviders = (app: App): App => {
  app.use(createPinia())
  app.use(router)

  return app
}
