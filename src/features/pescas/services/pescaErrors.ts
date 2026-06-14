import { PescaFormErrors } from "../types/pesca.types";

export class DuplicateLacreError extends Error {
    constructor(message = "Este lacre ja foi registrado.") {
        super(message);
        this.name = "DuplicateLacreError";
    }
}

export class InvalidPescaDataError extends Error {
    constructor(
        message = "Dados de pescado invalidos.",
        readonly errors?: PescaFormErrors,
    ) {
        super(message);
        this.name = "InvalidPescaDataError";
    }
}

export class InvalidPescaLocationError extends Error {
    constructor(message = "Local de pesca invalido.") {
        super(message);
        this.name = "InvalidPescaLocationError";
    }
}

export class PescaPersistenceError extends Error {
    constructor(message = "Nao foi possivel salvar o pescado.") {
        super(message);
        this.name = "PescaPersistenceError";
    }
}
