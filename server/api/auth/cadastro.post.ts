import { eq } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'
import { hash } from '@node-rs/argon2'
import { SignJWT } from 'jose'

export default defineEventHandler(async event => {
	const db = useDrizzle()
	const body = (await readBody(event)) as CadastroRequest
	// OBS: a dataInicio e dataFim são retiradas depois, ao confirmar que o permissao é estagiario
	const { nome, email, senha, permissao } = body

	if (!nome || !email || !senha || !permissao) {
		throw createError({
			statusCode: 400,
			message: 'Campos obrigatórios ausentes',
		})
	}

	if (permissao === TipoUsuario.ESTAGIARIO && !body.dataInicio) {
		throw createError({
			statusCode: 400,
			message: 'Data de início é obrigatória para estagiários',
		})
	}

	if (senha.length < 8) {
		throw createError({
			statusCode: 400,
			message: 'A senha deve ter pelo menos 8 caracteres',
		})
	}

	try {
		//checar se usuario ja existe
		const usuarioExistente = await db
			.select({ email: schema.usuario.email })
			.from(schema.usuario)
			.where(eq(schema.usuario.email, email))

		if (usuarioExistente.length) {
			throw createError({ statusCode: 400, message: 'Email já cadastrado' })
		}

		//transformar senha em hash
		const senhaHash = await hash(senha)

		//inserir usuario no banco de dados
		let usuario: UsuarioPublico
		let result

		if (permissao === TipoUsuario.ADMIN) {
			result = (
				await db
					.insert(schema.usuario)
					.values({ nome, email, senha: senhaHash, permissao })
					.returning({
						nome: schema.usuario.nome,
						email: schema.usuario.email,
					})
			)[0]
			usuario = { ...result, permissao: TipoUsuario.ADMIN }
		} else if (permissao === TipoUsuario.ESTAGIARIO) {
			const dataInicio = body.dataInicio
			const dataFim = body.dataFim

			result = (
				await db
					.insert(schema.usuario)
					.values({
						nome,
						email,
						senha: senhaHash,
						permissao,
						dataInicio,
						dataFim,
					})
					.returning({
						nome: schema.usuario.nome,
						email: schema.usuario.email,
						dataInicio: schema.usuario.dataInicio,
						dataFim: schema.usuario.dataFim,
					})
			)[0]
			usuario = {
				nome: result.nome,
				email: result.email,
				permissao: TipoUsuario.ESTAGIARIO,
				dataInicio: result.dataInicio!,
				dataFim: result.dataFim ?? undefined,
			}
		} else {
			throw createError({ statusCode: 400, message: 'Permissão inválida' })
		}

		return { usuario } as CadastroResponse
	} catch (err: any) {
		switch (err?.code) {
			case '23505':
				throw createError({
					statusCode: 400,
					message: 'Email já cadastrado',
				})
			case '23514':
				throw createError({ statusCode: 400, message: 'Dados inválidos' })
		}
		throw err
	}
})
