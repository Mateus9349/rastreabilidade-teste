/**
 * Converte coordenadas DMS (graus, minutos, segundos) em decimal.
 * Exemplo: "02º35'31.90''S" => -2.592194
 */
function dmsToDecimal(dms: string): number | null {
    if (!dms) return null;

    const regex = /(\d{1,3})[°º](\d{1,2})'(\d{1,2}(?:\.\d+)?)''([NSLO])/i;
    const match = dms.match(regex);
    if (!match) return null;

    const [, graus, minutos, segundos, direcao] = match;
    let decimal = Number(graus) + Number(minutos) / 60 + Number(segundos) / 3600;

    if (/[SO]/i.test(direcao)) decimal *= -1; // Sul e Oeste são negativos

    return Number(decimal.toFixed(6));
}

export interface Lago {
    nome: string;
    latitude: number | null;
    longitude: number | null;
}

export interface Comunidade {
    nome: string;
    lagos: Lago[];
}

export const comunidades: Comunidade[] = [
    {
        nome: "Mangueira",
        lagos: [
            { nome: "Lago-Comprido Grande", latitude: dmsToDecimal("02º35'31.90''S"), longitude: dmsToDecimal("065º27'23.81''O") },
            { nome: "Lago-Compridinho", latitude: dmsToDecimal("02º36'11.04''S"), longitude: dmsToDecimal("065º26'46.32''O") },
            { nome: "Lago-Branco", latitude: dmsToDecimal("02º35'17.01''S"), longitude: dmsToDecimal("065º26'52.77''O") },
            { nome: "Lago-Açaí", latitude: dmsToDecimal("02º37'27.37''S"), longitude: dmsToDecimal("065º26'15.40''O") },
            { nome: "Lago-Açaizinho", latitude: dmsToDecimal("02º37'40.18''S"), longitude: dmsToDecimal("065º26'25.25''O") },
            { nome: "Lago-Jucunari", latitude: null, longitude: null },
            { nome: "Lago-Tracajá", latitude: dmsToDecimal("02º37'06.49''S"), longitude: dmsToDecimal("065º26'26.95''O") },
        ],
    },
    {
        nome: "Catiti e Mangueira",
        lagos: [
            { nome: "Lago-Igarapé Grande", latitude: null, longitude: null },
            { nome: "Lago-Tucuxi", latitude: null, longitude: null },
            { nome: "Lago-Tucuxizinho", latitude: null, longitude: null },
            { nome: "Lago-Anzol", latitude: dmsToDecimal("02º39'13.88''S"), longitude: dmsToDecimal("065º28'47.09''O") },
        ],
    },
    {
        nome: "Jussara",
        lagos: [
            { nome: "Lago-Tambauzinho", latitude: null, longitude: null },
            { nome: "Lago-Macaco Prego", latitude: null, longitude: null },
            { nome: "Lago-Chico Bunhusuzinho", latitude: null, longitude: null },
            { nome: "Lago-Pupunhal", latitude: dmsToDecimal("02º39'46.21''S"), longitude: dmsToDecimal("065º24'15.48''O") },
            { nome: "Lago-Branco", latitude: null, longitude: null },
            { nome: "Lago-Araçá", latitude: null, longitude: null },
        ],
    },
];

// Versões resumidas (apenas nomes)
export const saoFranciscoDaMangueira = {
    nome: "Mangueira",
    lagos: [
        "Lago-Comprido Grande",
        "Lago-Compridinho",
        "Lago-Branco",
        "Lago-Açaí",
        "Lago-Açaizinho",
        "Lago-Jucunari",
        "Lago-Tracajá",
    ],
};

export const catitiESaoFranciscoDaMangueira = {
    nome: "Catiti",
    lagos: ["Lago-Igarapé Grande", "Lago-Tucuxi", "Lago-Tucuxizinho", "Lago-Anzol"],
};

export const comunidadeJussara = {
    nome: "Jussara",
    lagos: [
        "Lago-Tambauzinho",
        "Lago-Macaco Prego",
        "Lago-Chico Bunhusuzinho",
        "Lago-Pupunhal",
        "Lago-Branco",
        "Lago-Araçá",
    ],
};
