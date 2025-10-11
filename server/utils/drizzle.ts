import 'dotenv/config'
import { createDatabase } from 'db0'
import postgresql from 'db0/connectors/postgresql'
import { drizzle } from 'db0/integrations/drizzle'
import * as schema from '../database/schema/index'

export const env = {
	senha: process.env.POSTGRES_SENHA,
	usuario: process.env.POSTGRES_USUARIO,
	nome_db: process.env.POSTGRES_DB_NOME,
	jwt_secret: new TextEncoder().encode(process.env.JWT_SECRET as string),
} as { senha: string; usuario: string; nome_db: string; jwt_secret: Uint8Array }

const db0 = createDatabase(
	postgresql({
		url: `postgresql://${env.usuario}:${env.senha}@localhost:5432/${env.nome_db}`,
	})
)

export const useDrizzle = () => drizzle<typeof schema>(db0)
