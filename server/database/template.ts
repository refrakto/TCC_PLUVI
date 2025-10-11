import { pgTable, serial } from 'drizzle-orm/pg-core'

export const template = pgTable('template', {
	id: serial().primaryKey().unique(),
})

export type Template = typeof template.$inferSelect
export type NewTemplate = typeof template.$inferInsert
