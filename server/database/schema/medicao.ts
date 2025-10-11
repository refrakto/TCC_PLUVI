import { integer, pgTable, primaryKey, serial } from 'drizzle-orm/pg-core'
import { pluviometro } from './pluviometro'
import { chuva } from './chuva'

export const medicao = pgTable(
	'medicao',
	{
		idPluvi: integer()
			.notNull()
			.references(() => pluviometro.id),
		idChuva: integer()
			.notNull()
			.references(() => chuva.id),
	},
	table => [primaryKey({ columns: [table.idPluvi, table.idChuva] })]
)

export type Medicao = typeof medicao.$inferSelect
export type NewMedicao = typeof medicao.$inferInsert
