import { verify } from '@node-rs/argon2'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose/jwt/sign'
import * as schema from '~~/server/database/schema'

export default defineEventHandler(async event => {
	const db = useDrizzle()
	const { email, senha } = await readBody(event)

	const usuario = (
		await db
			.select()
			.from(schema.usuario)
			.where(eq(schema.usuario.email, email))
	)[0]

	if (!usuario || !(await verify(usuario.senha, senha))) {
		throw createError({ statusCode: 401, message: 'Credenciais inválidas' })
	}

	const token = await new SignJWT({ usuarioId: usuario.id })
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('24h')
		.sign(env.jwt_secret)

	const usuarioSeguro: UsuarioSeguro = {
		id: usuario.id,
		email: usuario.email,
		nome: usuario.nome,
	}

	return { token, usuario: usuarioSeguro } as Cadastro
})
