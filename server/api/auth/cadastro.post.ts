import { eq } from 'drizzle-orm'
import * as schema from '~~/server/database/schema'
import { hash } from '@node-rs/argon2'
import { SignJWT } from 'jose'

export default defineEventHandler(async event => {
	const db = useDrizzle()
	const { nome, email, senha } = await readBody(event)

	if (!nome || !email || !senha) {
		throw createError({
			statusCode: 400,
			message: 'Campos obrigatórios ausentes',
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
		const usuario: UsuarioSeguro = (
			await db
				.insert(schema.usuario)
				.values({ nome, email, senha: senhaHash })
				.returning({
					id: schema.usuario.id,
					nome: schema.usuario.nome,
					email: schema.usuario.email,
				})
		)[0]

		//gerar token JWT
		const token = await new SignJWT({ id: usuario.id })
			.setProtectedHeader({ alg: 'HS256' })
			.setExpirationTime('24h')
			.sign(env.jwt_secret)

		return { token, usuario } as Cadastro
	} catch (error: any) {
		throw error
	}
})
