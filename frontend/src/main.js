import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // 这行把 Pinia 挂到整个 Vue 应用根上之后，下面所有组件树里的 useUserStore() 才会连到同一块内存里的那份状态。

app.use(router)

app.mount('#app')
