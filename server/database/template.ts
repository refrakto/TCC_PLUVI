import { pgTable, integer } from 'drizzle-orm/pg-core'

export const template = pgTable('template', {
	id: integer().primaryKey().unique(),
})

export type Template = typeof template.$inferInsert
export type NewTemplate = typeof template.$inferSelect
