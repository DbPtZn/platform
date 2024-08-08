// import 'reflect-metadata'
import { ObjectPlugin, createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { createI18n } from 'vue-i18n'
import Vue3TouchEvents from 'vue3-touch-events'

import zh from './assets/locales/zh.json'
import en from './assets/locales/en.json'
import ja from './assets/locales/ja.json'

/** Pinia */
const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = router
})

/** i18n */
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh',
  messages: {
    zh,
    en,
    ja
  }
})

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Vue3TouchEvents as ObjectPlugin)
app.mount('#app')
