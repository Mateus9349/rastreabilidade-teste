import { IPeixeDTO } from "./Peixe.DTO";
export type ISODateTimeString = string;

export interface ILoteDTO {
    id: number;
    planilha: number;
    comunidade: string;
    setor: string;
    assistente: string;
    barco: string;
    data: string;
    apetrechos: string;
    ambiente: string;
    quantidade: number;
    quantidadeF: number;
    quantidadeM: number;
    pesoTotal: number;
    ativo: 0 | 1;
    recebidoSalgadeira: boolean;
    createdAt?: string;
    updatedAt?: string;
    createdBy: string;
    updatedBy?: string | null;
    destino?: string | null;

    // Estes dois campos são retornados pelo backend
    peixes: IPeixeDTO[];
    community?: {
        id: number;
        nome: string;
        latitude: number;
        longitude: number;
    };
}

export interface LoteOnlyDTO {
    planilha: number;
    comunidade: string;
    setor: string;
    assistente: string;
    barco: string;
    data: ISODateTimeString;
    apetrechos: string;
    ambiente: string;
    quantidade: number;
    quantidadeF: number;
    quantidadeM: number;
    pesoTotal: number;
    peixes: number[];            // <- OBRIGATÓRIO: enviar [] na criação
    ativo: 0 | 1;
    recebidoSalgadeira: boolean;
    createdBy: string;
    comunidadeId?: number;       // opcional, se seu backend aceitar
}
