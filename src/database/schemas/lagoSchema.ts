import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { comunidades } from "./comunidadeSchema";

export const lagos = sqliteTable("lagos", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    comunidadeId: integer("comunidade_id")
        .notNull()
        .references(() => comunidades.id), // FK para comunidade
});
