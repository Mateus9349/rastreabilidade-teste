import { IPeixe } from '../interfaces/Peixe';
import { parseDecimalBR } from './numberValidators';

const PESO_MIN = 40;
const PESO_MAX = 300;
const COMPRIMENTO_MIN = 1.5;
const COMPRIMENTO_MAX = 3;

export class PeixeFormularioValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PeixeFormularioValidationError';
    }
}

const normalizeRequiredText = (value: string | undefined, label: string) => {
    const normalized = (value ?? '').trim();

    if (!normalized) {
        throw new PeixeFormularioValidationError(`${label} e obrigatorio.`);
    }

    return normalized;
};

const normalizeDecimalInRange = (
    value: string | undefined,
    label: string,
    min: number,
    max: number,
) => {
    const raw = normalizeRequiredText(value, label);
    const parsed = parseDecimalBR(raw);

    if (parsed === null) {
        throw new PeixeFormularioValidationError(`${label} invalido.`);
    }

    if (parsed < min || parsed > max) {
        throw new PeixeFormularioValidationError(
            `${label} deve estar entre ${min} e ${max}.`,
        );
    }

    return String(parsed);
};

const normalizeRequiredDate = (value: string | undefined, label: string) => {
    const raw = normalizeRequiredText(value, label);
    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) {
        throw new PeixeFormularioValidationError(`${label} invalido.`);
    }

    return date.toISOString();
};

export const validarENormalizarPeixeFormulario = (dados: IPeixe): IPeixe => {
    const lacre = normalizeRequiredText(dados.lacre, 'Lacre');

    if (!/^\d+$/.test(lacre)) {
        throw new PeixeFormularioValidationError(
            'Lacre deve conter apenas numeros.',
        );
    }

    const sexo = normalizeRequiredText(dados.sexo, 'Sexo');

    if (sexo !== 'M' && sexo !== 'F') {
        throw new PeixeFormularioValidationError('Sexo invalido.');
    }

    return {
        especie: normalizeRequiredText(dados.especie, 'Especie'),
        cat: normalizeRequiredText(dados.cat, 'Categoria'),
        lacre,
        sexo,
        unidade: normalizeRequiredText(dados.unidade, 'Unidade'),
        gona: normalizeRequiredText(dados.gona, 'Estagio gonodal'),
        comprimento: normalizeDecimalInRange(
            dados.comprimento,
            'Comprimento',
            COMPRIMENTO_MIN,
            COMPRIMENTO_MAX,
        ),
        peso: normalizeDecimalInRange(dados.peso, 'Peso', PESO_MIN, PESO_MAX),
        hPesca: normalizeRequiredDate(dados.hPesca, 'Horario da pesca'),
        lago: normalizeRequiredText(dados.lago, 'Lago'),
        comunidade: normalizeRequiredText(dados.comunidade, 'Comunidade'),
        hEvisceramento: normalizeRequiredDate(
            dados.hEvisceramento,
            'Horario da evisceracao',
        ),
    };
};
