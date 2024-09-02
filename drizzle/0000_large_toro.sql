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
	`hEvisceramento` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
