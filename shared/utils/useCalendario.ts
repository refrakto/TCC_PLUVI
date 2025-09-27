import type { Dayjs } from "dayjs"

type Cal = Col[]

type Col = {
  dias: Dia[]
}

type Dia = {
  js: Dayjs
  mesSelecionado: boolean
}

const Dia = (js: Dayjs, mesSelecionado: boolean): Dia => ({ js, mesSelecionado })

export default (data: Dayjs) => {
  const primeiroDiaMes = data.startOf('month');
  const PrimeiroDiaSemana = primeiroDiaMes.day();

  const dias: Dia[] = [];
  for (let i = PrimeiroDiaSemana-1; i >= 0; i--) {
    dias.unshift(Dia(primeiroDiaMes.date(-i), false));
  }
}
