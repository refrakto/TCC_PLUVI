import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Tenta carregar o tema do navegador (localStorage), ou usa 'dark' como padrão.
  const currentTheme = ref<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  )

  // Classe CSS que será aplicada no <div> raiz de cada View.
  const themeClass = computed(() => (currentTheme.value === 'dark' ? 'tela-root' : 'tela-root light'))

  // Função para alternar entre os temas
  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', currentTheme.value) // Persiste a escolha
  }

  return {
    currentTheme,
    themeClass,
    toggleTheme,
  }
})