import { defineConfig } from 'drizzle-kit'
import { env } from './server/utils/drizzle'

export default defineConfig({
	dialect: 'postgresql',
	schema: './server/database/schema/*',
	dbCredentials: {
		url: `postgresql://${env.usuario}:${env.senha}@localhost:5432/${env.nome_db}`
	}
})
