// LagoLocalService.ts
import { eq } from "drizzle-orm";
import { lagos } from "../../database/schemas/lagoSchema";
import { ILago } from "../../interfaces/Lago";
import { toNumberOrNull } from "../../utils/coords";

export class LagoLocalService {
    static async criar(db: any, dados: ILago) {
        const lat = toNumberOrNull(dados.latitude);
        const lon = toNumberOrNull(dados.longitude);
        return await db.insert(lagos).values({
            ...dados,
            latitude: lat,          // << sem fallback 0
            longitude: lon,         // << sem fallback 0
        });
    }

    static async atualizar(db: any, id: number, dados: Partial<ILago>) {
        const patch: Partial<ILago> = { ...dados };
        if (dados.latitude !== undefined) patch.latitude = toNumberOrNull(dados.latitude) ?? 0;
        if (dados.longitude !== undefined) patch.longitude = toNumberOrNull(dados.longitude) ?? 0;
        await db.update(lagos).set(patch).where(eq(lagos.id, id));
    }

    static async listar(db: any): Promise<ILago[]> {
        // se houver registros antigos com null/strings, converta aqui também (opcional)
        const rows = await db.select().from(lagos);
        return rows.map(r => ({
            ...r,
            latitude: toNumberOrNull(r.latitude) ?? 0,
            longitude: toNumberOrNull(r.longitude) ?? 0,
        }));
    }

    static async buscarPorId(db: any, id: number): Promise<ILago | undefined> {
        const [row] = await db.select().from(lagos).where(eq(lagos.id, id));
        if (!row) return undefined;
        return {
            ...row,
            latitude: toNumberOrNull(row.latitude) ?? 0,
            longitude: toNumberOrNull(row.longitude) ?? 0,
        };
    }

    static async deletar(db: any, id: number) {
        await db.delete(lagos).where(eq(lagos.id, id));
    }
}
