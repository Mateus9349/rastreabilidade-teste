export interface ILote {
    id?: number;
    planilha: number;
    //a informação passada no campo comunidade será o destino do lote
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
    recebidoSalgadeira?: boolean;
}