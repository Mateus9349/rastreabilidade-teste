import { relations } from "drizzle-orm";
import { comunidades } from "./schemas/comunidadeSchema";
import { lagos } from "./schemas/lagoSchema";

export const comunidadesRelations = relations(comunidades, ({ many }) => ({
  lagos: many(lagos), // uma comunidade tem vários lagos
}));

export const lagosRelations = relations(lagos, ({ one }) => ({
  comunidade: one(comunidades, {
    fields: [lagos.comunidadeId],
    references: [comunidades.id],
  }),
}));
