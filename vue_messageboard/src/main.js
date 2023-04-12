import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import gAuthPlugin from 'vue3-google-login'
let gauthClientId =
  '542822140028-k0768b621u9urhgiemf39d4fagun4abq.apps.googleusercontent.com'
app.use(gAuthPlugin, {
  clientId: gauthClientId
})
app.mount('#app')

// prompt: 'consent'
