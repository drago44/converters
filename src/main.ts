import { createApp } from 'vue'
import App from './app/App.vue'
import { withProviders } from './app/providers'
import '@/shared/styles/global.css'

withProviders(createApp(App)).mount('#app')
