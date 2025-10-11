import { date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const usuario = pgTable('template', {
	id: serial().primaryKey().unique(),
	nome: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull().unique(),
	senha: varchar({ length: 100 }).notNull(),
})

export const administrador = pgTable('administrador', {
	id: integer()
		.primaryKey()
		.references(() => usuario.id),
})

export const estagiario = pgTable('estagiario', {
	id: integer()
		.primaryKey()
		.references(() => usuario.id),
	dataInicio: date().notNull(),
	dataFim: date(),
})

export type Usuario = typeof usuario.$inferSelect
export type NovoUsuario = typeof usuario.$inferInsert

export type Administrador = typeof administrador.$inferSelect
export type NovoAdministrador = typeof administrador.$inferInsert

export type Estagiario = typeof estagiario.$inferSelect
export type NovoEstagiario = typeof estagiario.$inferInsert
