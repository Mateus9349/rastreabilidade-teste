interface ILote {
    id?: number;
    planilha: number;
    comunidade: string;
    setor: string;
    assistente: string;
    barco: string;
    data: Date;
    apetrechos: string;
    ambiente: string;
    quantidade: number;
    quantidadeF: number;
    quantidadeM: number;
    pesoTotal: number;
    peixes: string[];
    ativo?: number;
}