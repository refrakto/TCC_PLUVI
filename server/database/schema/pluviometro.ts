import { pgTable, serial } from 'drizzle-orm/pg-core'

export const pluviometro = pgTable('template', {
	id: serial().primaryKey().unique(),
})

export type Pluviometro = typeof pluviometro.$inferSelect
export type NewPluviometro = typeof pluviometro.$inferInsert
