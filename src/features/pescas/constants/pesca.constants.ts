import { PescaFormData } from "../types/pesca.types";

export const LACRE_MAX_LENGTH = 20;
export const LACRE_DEBOUNCE_MS = 400;

export const PESO_MIN = 40;
export const PESO_MAX = 300;
export const COMPRIMENTO_MIN = 1.5;
export const COMPRIMENTO_MAX = 3;

export const SEXO_OPTIONS = ["M", "F"];
export const GONA_MACHO_OPTION = "não possui";
export const GONA_FEMEA_OPTIONS = [
    "I - Roseo sem presença de Ova",
    "II - Roseo com presença de Ova",
    "III - Ovas Verde Claro",
    "IV - Ovas Verde Escuro",
];

export const INITIAL_PESCA_FORM_DATA: PescaFormData = {
    especie: "Pirarucu",
    cat: "IE(Inteiro Eviscerado)",
    lacre: "",
    sexo: "",
    unidade: "1",
    gona: "",
    comprimento: "",
    peso: "",
    hPesca: "",
    lago: "",
    comunidade: "",
    hEvisceramento: "",
};
