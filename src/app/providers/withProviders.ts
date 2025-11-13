import type { App } from 'vue'
import router from '@/app/router'

export const withProviders = (app: App): App => {
  app.use(router)

  return app
}
