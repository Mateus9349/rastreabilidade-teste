export type ISODateTimeString = string;
export type Sexo = 'Macho' | 'Fêmea';
export type StatusItem = 'PENDING' | 'CONFIRMED' | 'BENEFITED' | 'REJECTED';


export interface IPeixeDTO {
    especie: string;
    cat: string;
    lacre: number;                
    loteId: number;               
    sexo: Sexo;
    unidade: string;
    gona: string;
    comprimento: string;
    peso: string;
    hPesca: ISODateTimeString;
    lago: string;
    comunidade: string;
    hEvisceramento: ISODateTimeString;
    hChegadaSalgadeira ?: ISODateTimeString | "";
    createdBy: string;
    status: StatusItem;
};