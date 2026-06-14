import { NewPesca, PescaFormData } from "../types/pesca.types";

export function mapPescaFormToDatabase(formData: PescaFormData): NewPesca {
    return {
        especie: formData.especie,
        cat: formData.cat,
        lacre: formData.lacre,
        sexo: formData.sexo,
        unidade: formData.unidade,
        gona: formData.gona,
        comprimento: formData.comprimento,
        peso: formData.peso,
        hPesca: formData.hPesca,
        lago: formData.lago,
        comunidade: formData.comunidade,
        hEvisceramento: formData.hEvisceramento,
    };
}
