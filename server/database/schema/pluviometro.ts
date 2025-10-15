import { boolean, date, pgTable, serial } from 'drizzle-orm/pg-core'

export const pluviometro = pgTable('template', {
	id: serial().primaryKey().unique(),
	arquivado: boolean().notNull(),
	dataAquisicao: date({mode: 'date'})
})

export type Pluviometro = typeof pluviometro.$inferSelect
export type NewPluviometro = typeof pluviometro.$inferInsert
