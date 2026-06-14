import { IPeixe } from "../interfaces/Peixe";
import { InvalidPescaDataError } from "../features/pescas/services/pescaErrors";
import { validatePescaFormData } from "../features/pescas/schemas/pescaFormSchema";

export class PeixeFormularioValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PeixeFormularioValidationError";
    }
}

export const validarENormalizarPeixeFormulario = (dados: IPeixe): IPeixe => {
    const result = validatePescaFormData(dados);

    if (!result.success) {
        const firstMessage =
            Object.values(result.errors).find(Boolean) ??
            "Dados de pescado invalidos.";

        throw new PeixeFormularioValidationError(firstMessage);
    }

    return result.data;
};

export { InvalidPescaDataError };
