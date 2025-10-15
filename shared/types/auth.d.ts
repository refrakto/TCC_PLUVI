/* ===== Tipos de autenticação ===== */

/* ---------------- Tipos auxiliares (não exportados globalmente) ---------------- */
/** Base comum (não exportada) usada internamente nas declarações públicas */
interface UsuarioPublicoBase {
	nome: string
	email: string
}

/** Base para criação (não exportada) */
interface CriarUsuario {
	nome: string
	email: string
	senha: string
}

declare global {
	/**
	 * Níveis de permissão conforme armazenado.
	 * @property ESTAGIARIO - 'estagiario'
	 * @property ADMIN - 'admin'
	 */
	enum TipoUsuario {
		ESTAGIARIO = 'estagiario',
		ADMIN = 'admin',
	}

	/**
	 * Linha da tabela `usuario` (DB).
	 * @property id - chave primária (number)
	 * @property nome - nome completo (string)
	 * @property email - email único (string)
	 * @property senha - hash da senha (string)
	 * @property permissao - papel do usuário (TipoUsuario)
	 * @property dataInicio - data de início do estágio (Date | null)
	 * @property dataFim - data de fim do estágio (Date | null)
	 */
	interface UsuarioDB {
		id: number
		nome: string
		email: string
		senha: string
		permissao: TipoUsuario
		dataInicio?: Date | null
		dataFim?: Date | null
	}

	/**
	 * Usuário público quando o papel é ESTAGIARIO.
	 * Campos:
	 * @property nome - nome completo (string)
	 * @property email - email (string)
	 * @property permissao - sempre TipoUsuario.ESTAGIARIO
	 * @property dataInicio - data de início do estágio (Date)
	 * @property dataFim - data de fim do estágio (Date | undefined)
	 */
	interface EstagiarioPublico extends UsuarioPublicoBase {
		permissao: TipoUsuario.ESTAGIARIO
		dataInicio: Date // YYYY-MM-DD
		dataFim?: Date
	}

	/**
	 * Usuário público quando o papel é ADMIN.
	 * Campos:
	 * @property nome - nome completo (string)
	 * @property email - email (string)
	 * @property permissao - sempre TipoUsuario.ADMIN
	 */
	interface AdministradorPublico extends UsuarioPublicoBase {
		permissao: TipoUsuario.ADMIN
	}

	/**
	 * União discriminada que representa o usuário público retornado pela API.
	 * Campos:
	 * @property nome - nome completo (string)
	 * @property email - email (string)
	 * @property permissao - (TipoUsuario.ESTAGIARIO | TipoUsuario.ADMIN)
	 * @property dataInicio - ESTAGIARIO: data de início do estágio (Date)
	 * @property dataFim - ESTAGIARIO: data de fim do estágio (Date | undefined)
	 */
	type UsuarioPublico = EstagiarioPublico | AdministradorPublico

	interface CriarEstagiarioRequest extends CriarUsuario {
		permissao: TipoUsuario.ESTAGIARIO
		dataInicio: Date
		dataFim?: Date
	}

	interface CriarAdministradorRequest extends CriarUsuario {
		permissao: TipoUsuario.ADMIN
	}

	/**
	 * Requisição para "/api/auth/cadastro".
	 * Campos:
	 * @property nome - nome do usuário (string)
	 * @property email - email do usuário (string)
	 * @property senha - senha em texto (string)
	 * @property permissao - (TipoUsuario.ESTAGIARIO | TipoUsuario.ADMIN)
	 * @property ESTAGIARIO: dataInicio - data de início do estágio (Date)
	 * @property ESTAGIARIO: dataFim - data de fim do estágio (Date | undefined)
	 */
	type CadastroRequest = CriarEstagiarioRequest | CriarAdministradorRequest

	/** Resposta do "/api/auth/cadastro": { usuario: UsuarioPublico } */
	interface CadastroResponse {
		usuario: UsuarioPublico
	}

	/** Requisição para "/api/auth/login". { email: string, senha: string }. */
	interface LoginRequest {
		email: string
		senha: string
	}

	/** Resposta do "/api/auth/login": { token: string, usuario: UsuarioPublico } */
	interface LoginResponse {
		token: string
		usuario: UsuarioPublico
	}

	/** Resposta do "/api/auth/check": { usuario: UsuarioPublico } */
	interface CheckResponse {
		usuario: UsuarioPublico
	}

	/** Estado de autenticação usado pelo cliente/store.
	 * @property token - string | null
	 * @property usuario - UsuarioPublico | null
	 * @property autenticado - true quando autenticado
	 * @property carregando - indica carregamento inicial
	 */
	interface EstadoAuth {
		token: string | null
		usuario: UsuarioPublico | null
		autenticado: boolean
		carregando: boolean
	}
}

export {}
