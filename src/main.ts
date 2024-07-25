import './assets/tailwind.css'
import 'vue3-easy-data-table/dist/style.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vue-multiselect/dist/vue-multiselect.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.component('EasyDataTable', Vue3EasyDataTable)
app.use(VueSweetalert2)
app.use(createPinia())
app.use(router)

app.mount('#app')
