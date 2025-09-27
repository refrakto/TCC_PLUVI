<template>
  <inline-flex flex-col>
    <inline-flex id="Semanas">
      <template v-for="(dia, index) in diasSemanas">
        <p class="diasSemana"> {{dia}} </p>
      </template> 
    </inline-flex>

    <template v-for="(coluna, index) in diasCalendario.colunas">
        <flex h-fit w-full>
          <template v-for="(dia, index2) in coluna.dias">
            <p class="dias" :class="dia.mesSelecionado ? 'bg-gray-200' : 'bg-gray-50'"> {{dia.js.date()}} </p>
          </template>
        </flex>
        
    </template>
  </inline-flex>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
var diasSemanas = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const hoje = dayjs();
const primeiroDiaMes = hoje.startOf('month');
const PrimeiroDiaSemana = primeiroDiaMes.day();

const diasCalendario = computed(() => {
  const total: Coluna = new Coluna();
  for (let i = PrimeiroDiaSemana-1; i >= 0; i--) {
    total.unshift(new Dia(primeiroDiaMes.date(-i), false));
  }

  let length = total.length();
  for (let i = 1; i <= 42-length; i++) {
    let temp = primeiroDiaMes.date(i);
    total.push(new Dia(temp, temp.month() === hoje.month()));
  }

  const result: Calendario = new Calendario();
  for (let i = 0; i <= 5; i++) {
    result.push(total.part(i));
  }

  console.log(JSON.stringify(result));
  return result;
})
//criar o resto com flex h-fit tendo as datas e as barras.
</script>

<style scoped>
.diasSemana {
  --a: text-lg p-3 bg-white font-bold w-18 text-center
}

.dias {
  --a: text-md font-bold text-center w-full
}
.primeiro {
  --a: rounded-l-lg
}

.ultimo {
  --a: rounded-r-lg
}
</style>