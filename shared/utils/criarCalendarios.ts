 import type { Dayjs } from 'dayjs';

export class Calendario {
    public colunas: Coluna[] = [];
    
    
    public length = () => this.colunas.length;

    public getColunas(valor?: number) {
        if (valor !== undefined) return this.colunas[valor];
        return this.colunas;
    }

    public push(coluna: Coluna) {
        this.colunas.push(coluna);
    }
    
}

export class Coluna {
    public dias: Dia[] = [];

    public length = () => this.dias.length;

    public push(dia: Dia) {
        this.dias.push(dia);
    }

    public unshift(dia: Dia) {
        this.dias.unshift(dia);
    }

    public part(num: number) {
        return new Coluna(this.dias.slice(0+(num*7), 7+(num*7)));
    }

    constructor(dias?: Dia[]) {
        if (dias) this.dias = dias;
    }
}

export class Dia {
    js: Dayjs;
    mesSelecionado: boolean;

    constructor(js: Dayjs, mesSelecionado: boolean) {
        this.js = js;
        this.mesSelecionado = mesSelecionado;
    }
}