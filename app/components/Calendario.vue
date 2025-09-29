<style lang="sass" scoped>
.diasSemana
  --a: text-(center lg) font-bold p-3 bg-white  w-18;

.dias
  --a: text-(center md) font-bold w-full;

.primeiro
  --a: rounded-l-lg;

.ultimo
  --a: rounded-r-lg;
</style>

<template>
  <inline-flex flex-col>
    
    <inline-flex>
      <template v-for="(dia, index) in diasSemanas">
        <p class="diasSemana" > {{dia}} </p>
      </template> 
    </inline-flex>

    <template v-for="(coluna, index) in calendario">
        <flex h-fit w-full>
          <template v-for="(dia, index2) in coluna.dias">
            <p class="dias" :class="dia.mesSelecionado ? 'bg-gray-200' : 'bg-gray-50'"> 
              {{dia.js.date()}} 
            </p>
          </template>
        </flex>
        
        
    </template>
  </inline-flex>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
var diasSemanas = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const indice = ref(0);

const { calendario, dataSelecionada } = useCalendario(indice);
//criar o resto com flex h-fit tendo as datas e as barras.
</script>

