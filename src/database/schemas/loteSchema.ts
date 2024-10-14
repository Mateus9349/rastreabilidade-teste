import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Define a tabela "lotes"
export const lote = sqliteTable("lotes", {
  id: integer("id").primaryKey(), // Campo ID como chave primária com incremento automático
  planilha: integer("planilha").notNull(), // Campo "planilha" como número não nulo
  comunidade: text("comunidade").notNull(), // Campo "comunidade" como texto não nulo
  setor: text("setor").notNull(), // Campo "setor" como texto não nulo
  assistente: text("assistente").notNull(), // Campo "assistente" como texto não nulo
  barco: text("barco").notNull(), // Campo "barco" como texto não nulo
  data: text("data").notNull(), // Campo "data" como data não nula
  apetrechos: text("apetrechos").notNull(), // Campo "apetrechos" como texto não nulo
  ambiente: text("ambiente").notNull(), // Campo "ambiente" como texto não nulo
  quantidade: integer("quantidade").notNull(), // Campo "quantidade" como número não nulo
  quantidadeF: integer("quantidadeF").notNull(), // Campo "quantidadeF" como número não nulo
  quantidadeM: integer("quantidadeM").notNull(), // Campo "quantidadeM" como número não nulo
  pesoTotal: text("pesoTotal").notNull(), // Campo "pesoTotal" como texto não nulo
  peixes: text("peixes").notNull(), // Campo "peixes" como texto não nulo para armazenar IDs ou lacres dos peixes
});
