/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Styles
import "@/assets/css/global.scss"

// Components
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Composables
import { createApp } from 'vue'
import router from './router'
import { TinyEmitter } from "tiny-emitter"

const app = createApp(App)
const pinia = createPinia()
export const emitter = new TinyEmitter()

pinia.use(piniaPluginPersistedstate)

registerPlugins(app)

app.use(pinia)
app.use(router)
app.mount('#app')

