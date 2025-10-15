import { eq } from 'drizzle-orm'
import { jwtVerify } from 'jose'
import * as schema from '~~/server/database/schema'

export default defineEventHandler(async event => {
	const db = useDrizzle()
	const authHeader = getHeader(event, 'authorization')

	const token = authHeader?.split(' ')[1]

	if (!token) {
		throw createError({
			statusCode: 401,
			message: 'Nenhum token providenciado',
		})
	}

	try {
		const { payload } = await jwtVerify(token, env.jwt_secret)
		const usuario = (
			await db
				.select({
					nome: schema.usuario.nome,
					email: schema.usuario.email,
					permissao: schema.usuario.permissao,
					dataInicio: schema.usuario.dataInicio,
					dataFim: schema.usuario.dataFim,
				})
				.from(schema.usuario)
				.where(eq(schema.usuario.id, payload.id as number))
		)[0]

		if (!usuario) throw new Error('Usuario não encontrado')

		const { nome, email, dataInicio, dataFim } = usuario

		const permissao =
			usuario.permissao === 'admin'
				? TipoUsuario.ADMIN
				: TipoUsuario.ESTAGIARIO

		let retorno: UsuarioPublico =
			permissao === TipoUsuario.ADMIN
				? { nome, email, permissao }
				: {
						nome,
						email,
						permissao,
						dataInicio: dataInicio!,
						dataFim: dataFim ?? undefined,
					}

		return { usuario: retorno } as CheckResponse
	} catch (err: any) {
		throw createError({ statusCode: 401, message: 'Token inválido' })
	}
})
