import { createApp } from 'vue';
import App from './app/App.vue';
import { withProviders } from './app/providers';

withProviders(createApp(App)).mount('#app');
