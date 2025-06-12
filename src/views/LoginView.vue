<script setup lang="ts">
import LoginBox from '../components/LoginBox.vue'
</script>

<template>
  <div class="mainPage">
    <div class="box">
      <LoginBox />
      <div class="titulo">
        <h1><n>SIMP-IFRJ</n></h1>
        <a>Sistema Inteligente de Monitoramento Pluviométrico</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'tailwindcss';

.mainPage {
  @apply w-screen h-screen flex items-center;
}

.box {
  @apply w-screen h-fit flex flex-wrap-reverse justify-center md:justify-around;

  & > * {
    @apply min-w-2/7 lg:max-w-2/5 m-8;
  }
}

.titulo {
  @apply text-center;
  @media (min-width: 710px) {
    @apply text-start;
  }

  & > h1 {
    font-weight: 900;
    font-size: clamp(3rem, 15vw, 5rem);
  }
  & > a {
    @apply text-wrap;
    font-weight: 300;
    font-size: clamp(2rem, 5vw, 2.5rem);
  }
}
</style>
