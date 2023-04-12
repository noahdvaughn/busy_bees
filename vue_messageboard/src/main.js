import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import gAuthPlugin from 'vue3-google-oauth2'
let gauthClientId =
  '542822140028-hi9ml494bongv164bkcig8jpu0vlo7kq.apps.googleusercontent.com'
app.use(gAuthPlugin, {
  clientId: gauthClientId,
  scope: 'email',
  prompt: 'consent'
})
app.mount('#app')
