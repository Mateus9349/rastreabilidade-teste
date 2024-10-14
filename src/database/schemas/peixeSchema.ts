import { boolean } from "drizzle-orm/mysql-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Define a tabela "peixes" com base na interface IPeixe
export const peixe = sqliteTable("peixes", {
  id: integer("id").primaryKey(), // Campo ID como chave primária com incremento automático
  especie: text("especie").notNull(),             // Campo "especie" como texto não nulo
  cat: text("cat").notNull(),                     // Campo "cat" como texto não nulo
  lacre: text("lacre").notNull(),                 // Campo "lacre" como texto não nulo
  sexo: text("sexo").notNull(),                   // Campo "sexo" como texto não nulo
  unidade: text("unidade").notNull(),             // Campo "unidade" como texto não nulo
  gona: text("gona").notNull(),                   // Campo "gona" como texto não nulo
  comprimento: text("comprimento").notNull(),     // Campo "comprimento" como texto não nulo
  peso: text("peso").notNull(),                   // Campo "peso" como texto não nulo
  hPesca: text("hPesca").notNull(),               // Campo "hPesca" como texto não nulo
  lago: text("lago").notNull(),                   // Campo "lago" como texto não nulo
  comunidade: text("comunidade").notNull(),       // Campo "comunidade" como texto não nulo
  hEvisceramento: text("hEvisceramento").notNull(), // Campo "hEvisceramento" como texto não nulo
});
