<style lang="sass" scoped>
.diasSemana
  --a: text-(center lg) font-bold px-3 bg-gray-200  w-18;

.dias
  --a: text-(center md) font-bold bg-gray-200 w-full;

.linhas
  --a: flex flex-row justify-evenly items-center nowrap size-full pointer-events-none;
  div 
    --a: w-[2px] h-full bg-black;
</style>

<template>
  <inline-flex flex-col rounded-xl>

    <inline-flex>
      <template v-for="(dia, index) in diasSemanas">
        <p class="diasSemana" > {{dia}} </p>
      </template> 
    </inline-flex>

    <flex flex-col size-full relative>

      <absolute class="linhas" z-10>
        <div v-for="n in 6" :key="n" />
      </absolute>

      <template v-for="(coluna, index) in calendario">
        <flex h-fit w-full>
          <template v-for="(dia, index2) in coluna.dias">
            <p class="dias"> {{dia.js.date()}} </p>
          </template>
        </flex>

        <flex h-10 w-full>
          <template v-for="(dia, index2) in coluna.dias">
            <p class="dias"> 
              <!--DEFINIR z-index -->
            </p>
          </template>
        </flex>
        
      </template>

    </flex>

  </inline-flex>
</template>

<script lang="ts" setup>
var diasSemanas = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const indice = ref(0);

const { calendario, dataSelecionada } = useCalendario(indice);
//criar o resto com flex h-fit tendo as datas e as barras.
</script>

