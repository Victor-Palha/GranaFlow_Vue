import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

const app = createApp(App)
app.use(PrimeVue)
app.use(ToastService)
app.use(createPinia())
app.use(VueApexCharts);
app.use(router)

app.mount('#app')
