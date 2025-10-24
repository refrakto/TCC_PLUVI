<script setup lang="ts">
import { computed } from 'vue';
import { Sun, Moon } from 'lucide-vue-next';
import LoginBox from '../components/LoginBox.vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
const currentTheme = computed(() => themeStore.currentTheme);
</script>

<template>
  <div :class="themeStore.themeClass">
    <header class="topbar-login">
      <div class="top-controls">
        <button class="icon" @click="themeStore.toggleTheme" :title="currentTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'">
          <component :is="currentTheme === 'dark' ? Sun : Moon" />
        </button>
      </div>
    </header>

    <div class="mainPage">
      <div class="box">
        <LoginBox /> 
        <div class="titulo">
          <h1>SIMP-IFRJ</h1>
          <a>Sistema Inteligente de Monitoramento Pluviométrico</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos replicados da TelaPrincipal */
.tela-root {
  min-height: 100vh;
  background: #222;
  color: #fff;
  font-family: Inter, Arial, sans-serif;
  transition: background 0.3s, color 0.3s;
}

.tela-root.light {
  background: #f1f3f5;
  color: #111;
}

/* --- Topbar de Login (Replicando o estilo da TelaPrincipal) --- */
.topbar-login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 18px 36px 0 36px;
}

.top-controls {
  display: flex;
  gap: 14px;
  align-items: center;
}

.icon {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
}


/* ---------------------------------------------------- */
/* Tailwind e Layout (Seu código original) */

@import 'tailwindcss';

.mainPage {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center; 
  margin-top: -50px; 
}

.box {
  @apply w-screen h-fit flex flex-wrap-reverse justify-center md:justify-around p-4;

  & > * {
    @apply w-full md:w-2/5 lg:max-w-2/5 m-8;
  }
}

.titulo {
  @apply text-center;
  @media (min-width: 710px) {
    @apply text-start;
  }

  & > h1 {
    font-weight: 800; 
    font-size: clamp(3rem, 15vw, 5rem);
  }
  & > a {
    @apply text-wrap;
    font-weight: 300;
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    display: block;
  }
}
</style>