import '@/styles/globals.css'
import '@livekit/components-styles'
import '@livekit/components-styles/prefabs'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router.js'

const app = createApp(App)
app.use(router)
app.mount('#root')
