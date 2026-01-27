CREATE TABLE `lotes` (
	`id` integer PRIMARY KEY NOT NULL,
	`planilha` integer NOT NULL,
	`comunidade` text NOT NULL,
	`setor` text NOT NULL,
	`assistente` text NOT NULL,
	`barco` text NOT NULL,
	`data` text NOT NULL,
	`apetrechos` text NOT NULL,
	`ambiente` text NOT NULL,
	`quantidade` integer NOT NULL,
	`quantidadeF` integer NOT NULL,
	`quantidadeM` integer NOT NULL,
	`pesoTotal` text NOT NULL,
	`peixes` text NOT NULL,
	`ativo` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `peixes` (
	`id` integer PRIMARY KEY NOT NULL,
	`especie` text NOT NULL,
	`cat` text NOT NULL,
	`lacre` text NOT NULL,
	`sexo` text NOT NULL,
	`unidade` text NOT NULL,
	`gona` text NOT NULL,
	`comprimento` text NOT NULL,
	`peso` text NOT NULL,
	`hPesca` text NOT NULL,
	`lago` text NOT NULL,
	`comunidade` text NOT NULL,
	`hEvisceramento` text NOT NULL,
	`ativo` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
