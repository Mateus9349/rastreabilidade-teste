// src/utils/inputSanitizers.ts

export const sanitizeInteger = (value: string) => {
    return value.replace(/[^0-9]/g, '');
};

export const sanitizeDecimal = (value: string) => {
    return value
        .replace(/,/g, '.')         // converte vírgula → ponto
        .replace(/[^0-9.]/g, '')    // remove lixo
        .replace(/(\..*)\./g, '$1'); // só 1 ponto
};