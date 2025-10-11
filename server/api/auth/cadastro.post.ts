import { eq } from "drizzle-orm"
import { usuario } from "~~/server/database/schema"
import { hash } from '@node-rs/argon2'
import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const { nome, email, senha } = await readBody(event)

  if (!nome || !email || !senha) {
    throw createError({
      statusCode: 400,
      message: 'Campos obrigatórios ausentes'
    })
  }

  if (senha.length < 8) {
    throw createError({
      statusCode: 400,
      message: 'A senha deve ter pelo menos 8 caracteres'
    })
  }

  try {
    const usuarioExistente = await db.select().from(usuario).where(eq(usuario.email, email)).get()

    if(usuarioExistente) {
      throw createError({
        statusCode: 400,
        message: 'Email já existente'
      })
    }

    const senhaHash = await hash(senha)

    const novoUsuario = await db.insert(usuario).values({
      nome,
      email,
      senha: senhaHash
    }).returning({ id: usuario.id, nome: usuario.nome, email: usuario.email }).get()

    const token = await new SignJWT({ usuarioId: novoUsuario.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(env.jwt_secret)

    return {
      token,
      user: {
        id: novoUsuario.id,
        email: novoUsuario.email,
        nome: novoUsuario.nome
      }
    }
  }
})
