// src/main.ts (ou src/main.js)

import { createApp } from 'vue'
import { createPinia } from 'pinia' // 👈 Importar Pinia
import App from './App.vue'
import router from './router' // Se estiver usando Vue Router
import './style.css' // Importe seus estilos globais

// 1. Crie a instância Pinia
const pinia = createPinia()

// 2. Crie a instância Vue
const app = createApp(App)

// 3. Adicione Pinia e Router à aplicação
app.use(pinia) // 👈 Usar Pinia
app.use(router)

// 4. Monte o app no DOM
app.mount('#app')