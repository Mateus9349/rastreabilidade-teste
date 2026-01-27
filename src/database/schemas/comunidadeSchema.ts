import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const comunidades = sqliteTable("comunidades", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
});
