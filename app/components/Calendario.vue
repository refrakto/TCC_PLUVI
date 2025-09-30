<style lang="sass" scoped>
.diasSemana
  --a: text-[28px] font-[750] place-content-center items-center px-3 w-18 h-8;

.dias
  --a: text-(center [16px]) font-[800] bg-gray-200 w-full;

.linhas
  --a: flex flex-row justify-evenly items-center size-full pointer-events-none;
  div 
    --a: w-[2px] h-full bg-black;
</style>

<template>
  <inline-flex flex-col rounded="[20px]" border-2>

    <inline-flex py-2 bg-gray-200>
      <template v-for="(dia, index) in diasSemanas">
        <flex class="diasSemana" > {{dia}} </flex>
      </template> 
    </inline-flex>

    <flex flex-col size-full relative>

      <absolute class="linhas" z-10>
        <div v-for="n in 6" :key="n" />
      </absolute>

      <template v-for="(coluna, index) in calendario">
        <flex h-fit w-full>
          <template v-for="(dia, index2) in coluna.dias">
            <p class="dias" :class="[dia.mesSelecionado ? 'text-black' : 'text-black/60']"> {{dia.js.date()}} </p>
          </template>
        </flex>

        <flex h-15 w-full>
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
var diasSemanas = ["D", "S", "T", "Q", "Q", "S", "S"];

const indice = ref(0);

const { calendario, dataSelecionada } = useCalendario(indice);
//criar o resto com flex h-fit tendo as datas e as barras.
</script>

