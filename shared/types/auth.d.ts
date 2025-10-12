interface UsuarioSeguro {
	id: number
	email: string
	nome: string
}

interface Cadastro {
	token: string
	usuario: UsuarioSeguro
}
