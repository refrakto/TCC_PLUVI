import { int, mysqlTable } from 'drizzle-orm/mysql-core'

export const template = mysqlTable('template', {
    id: int().primaryKey().autoincrement().unique()
})