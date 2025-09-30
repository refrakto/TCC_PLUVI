import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export type Cal = Col[]

export type Col = {
  dias: Dia[]
}

export type Dia = {
  js: Dayjs
  mesSelecionado: boolean
}

const newDia = (js: Dayjs, mesSelecionado: boolean): Dia => ({ js, mesSelecionado })

export default (indice: Ref<number>) => {
  
    const hoje = dayjs();
    const dataSelecionada = computed(() => hoje.month(hoje.month() + indice.value));

    const primeiroDiaMes = computed(() => dataSelecionada.value.startOf('month'));
    const primeiroDiaSemana = computed(() => primeiroDiaMes.value.day());

    const dias = computed(() => {
      const dias: Dia[] = [];
      //dias no calendário antes do mês selecionado
      for (let i = primeiroDiaSemana.value - 1; i >= 0; i--) {
        dias.unshift(newDia(primeiroDiaMes.value.date(-i), false));
      }

      //dias do mês selecionado e restantes
      const length = dias.length;
      for (let i=1; i<= 42- length; i++) {
        let temp = primeiroDiaMes.value.date(i);
        dias.push( newDia(temp, temp.month() === dataSelecionada.value.month()) );
      }
      return dias;
    });

    const calendario = computed(() => {
      const calendario: Cal = [];

      //separar nas colunas de cada semana do calendário
      for (let i = 0; i <= 5; i++) {
        calendario.push({ dias: dias.value.slice(0+(i*7), 7+(i*7)) });
      }
      return calendario;
    })
    
  return { calendario, dias, dataSelecionada, hoje };
}
