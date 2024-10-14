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
	`peixes` text NOT NULL
);
