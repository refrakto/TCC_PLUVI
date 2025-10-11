import { date, pgTable, serial } from 'drizzle-orm/pg-core'

export const chuva = pgTable('template', {
	id: serial().primaryKey().unique(),
	data: date().notNull(),
})

export type Chuva = typeof chuva.$inferSelect
export type NewChuva = typeof chuva.$inferInsert
