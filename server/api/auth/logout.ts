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
		const usuario: UsuarioSeguro = (
			await db
				.select({
					id: schema.usuario.id,
					email: schema.usuario.email,
					nome: schema.usuario.nome,
				})
				.from(schema.usuario)
				.where(eq(schema.usuario.id, payload.id as number))
		)[0]

		return {
      success: true,
      message: 'Desconectado com sucesso'
    }
	} catch (error) {
    console.error('Logout error:', error)
		throw createError({ statusCode: 401, message: 'Erro ao desconectar' })
	}
})
