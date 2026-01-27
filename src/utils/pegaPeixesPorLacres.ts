import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';
import { inArray } from "drizzle-orm";
import { IPeixe } from "../interfaces/Peixe";

export async function pegaPeixesSelecionados(db: any, lacres: string[]): Promise<IPeixe[]> {
    try {
        // Busca os peixes com lacres correspondentes
        const peixes: IPeixe[] = await db.query.peixe.findMany({
            where: inArray(peixeSchema.peixe.lacre, lacres),
        });
        return peixes;
    } catch (error) {
        console.error("Erro ao buscar peixes pelos lacres:", error);
        return [];
    }
}
