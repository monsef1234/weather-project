/**
 * main.ts
 * Bootstraps Vue application with Vuetify and other plugins
 */

// Vue Core
import { createApp } from 'vue'
import App from './App.vue'

// Router
import router from './router'

// State Management
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Event Management
import { TinyEmitter } from "tiny-emitter"

// Plugins and Styles
import { registerPlugins } from '@/plugins'
import "@/assets/css/global.scss"

// Initialize Event Bus
export const emitter = new TinyEmitter()

// Initialize Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create and Configure App
const app = createApp(App)

registerPlugins(app)
app
  .use(pinia)
  .use(router)
  .mount('#app')

