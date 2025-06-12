<script setup lang="ts">
</script>

<template>
    <div class="mainBox rounded-3xl">
        <input type="email" name="email" placeholder="Email">
        <div class="gap-y-2 grid auto-rows-auto">
          <input type="password" name="senha" placeholder="Senha">
          <a class="pl-4">Esqueci minha senha...</a>
        </div>

        <div class="gap-x-8 gap-y-4 flex flex-wrap basis-full">
            <button class="bg-green-400">Iniciar Sessão</button>
            <button class="bg-green-400">Cadastrar</button>
        </div>
        <button class="bg-sky-400 ">Entrar como Visitante</button>
      </div>
</template>

<style scoped>
@import "tailwindcss";

.mainBox {
    @apply bg-zinc-200 outline-2 outline-black  /*cor*/
     grid auto-rows-auto                            /*alinhamento*/
     px-4 py-5 gap-x-4 gap-y-4
     text-lg font-medium;                      /*espaçamento*/                 /*tamanho*/
}

input {
  /* Estilos do input e do botão */
  :is(&, button) {
    @apply rounded-full h-8 outline-2 outline-black w-full;
  }

  /* Estilos exclusivos do input */
  @apply pl-4 bg-white;

  &::placeholder {
    @apply text-black;
  }
}
</style>
