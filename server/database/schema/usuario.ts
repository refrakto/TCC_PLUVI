import { sql } from 'drizzle-orm'
import { check, date, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const TipoUsuarioEnum = pgEnum('TipoUsuario', ['estagiario', 'admin'])

export const usuario = pgTable('template', {
	id: serial().primaryKey().unique(),
	nome: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull().unique(),
	senha: varchar({ length: 100 }).notNull(),
	permissao: TipoUsuarioEnum().notNull(),
	dataInicio: date({mode: 'date'}),
	dataFim: date({mode: 'date'}),
}, (table) => [
		check(
			'check_estagiario_dataInicio_notNull',
			sql`(${table.permissao} != 'estagiario') OR (${table.dataInicio} IS NOT NULL)`
		),
		check(
			'check_admin_datas_null',
			sql`(${table.permissao} != 'admin') OR (${table.dataInicio} IS NULL AND ${table.dataFim} IS NULL)`
		)
	]
)

export type Usuario = typeof usuario.$inferSelect
export type NovoUsuario = typeof usuario.$inferInsert
