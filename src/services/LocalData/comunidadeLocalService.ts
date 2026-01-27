// src/services/ComunidadeService.ts
import { eq } from "drizzle-orm";
import { comunidades } from "../../database/schemas/comunidadeSchema";
import { IComunidade } from "../../interfaces/Comunidade";

export class ComunidadeLocalService {
    static async criar(db: any, dados: IComunidade) {
        return await db.insert(comunidades).values(dados);
    }

    static async listar(db: any): Promise<IComunidade[]> {
        return await db.select().from(comunidades);
    }

    static async buscarPorId(db: any, id: number): Promise<IComunidade | undefined> {
        const [comunidade] = await db
            .select()
            .from(comunidades)
            .where(eq(comunidades.id, id));
        return comunidade;
    }

    static async atualizar(db: any, id: number, dados: Partial<IComunidade>) {
        await db.update(comunidades).set(dados).where(eq(comunidades.id, id));
    }

    static async deletar(db: any, id: number) {
        await db.delete(comunidades).where(eq(comunidades.id, id));
    }
}
