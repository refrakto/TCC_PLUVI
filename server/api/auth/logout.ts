import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import * as schema from '~~/server/database/schema'

export default defineEventHandler(async event => {
	const db = useDrizzle()

	try {
		const authHeader = getHeader(event, 'authorization')

		const token = authHeader?.split(' ')[1]

		if (!token) {
			throw createError({
				statusCode: 401,
				message: 'Nenhum token providenciado',
			})
		}

		const { payload } = await jwtVerify(token, env.jwt_secret)

		if (!payload || typeof payload.id !== 'number') {
			throw createError({ statusCode: 401, message: 'Token inválido' })
		}

		return { success: true, message: 'Desconectado com sucesso' }
	} catch (err) {
		console.error('Logout error:', err)
		throw createError({ statusCode: 401, message: 'Erro ao desconectar' })
	}
})
