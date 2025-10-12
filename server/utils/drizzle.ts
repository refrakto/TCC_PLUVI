import 'dotenv/config'
import * as schema from '../database/schema/index'
import { drizzle } from 'drizzle-orm/node-postgres'

export const env = {
	senha: process.env.POSTGRES_SENHA,
	usuario: process.env.POSTGRES_USUARIO,
	nome_db: process.env.POSTGRES_DB_NOME,
	jwt_secret: new TextEncoder().encode(process.env.JWT_SECRET as string),
} as { senha: string; usuario: string; nome_db: string; jwt_secret: Uint8Array }

let db: ReturnType<typeof drizzle>

export const useDrizzle = () => {
	if (!db) {
		db = drizzle<typeof schema>(
			`postgresql://${env.usuario}:${env.senha}@localhost:5432/${env.nome_db}`
		)
	}
	return db
}
