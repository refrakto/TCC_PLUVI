

export const useAuthStore = defineStore('auth', () => {
	const state = ref<EstadoAuth>({
		usuario: null,
		token: null,
		autenticado: false,
		carregando: true,
	})

	function setUsuario(usuario: UsuarioPublico) {
		state.value.usuario = usuario
		state.value.autenticado = true
	}

	function setToken(newToken: string) {
		state.value.token = newToken
		localStorage.setItem('token', newToken)
	}

	function clearAuth() {
		state.value.usuario = null
		state.value.token = null
		state.value.autenticado = false
		localStorage.removeItem('token')
	}

	async function login(email: string, senha: string) {
		try {
			const resposta = await $fetch<LoginResponse>('/api/auth/login', {
				method: 'POST',
				body: { email, senha } as LoginRequest,
			})

			setToken(resposta.token)
			setUsuario(resposta.usuario)
			return true
		} catch (error) {
			console.error('Login failed:', error)
			return false
		}
	}

	async function cadastro(cadastro: CadastroRequest) {
		try {
			const resposta = await $fetch<CadastroResponse>('/api/auth/cadastro', {
				method: 'POST',
				body: cadastro,
			})

			return { success: true, usuario: resposta.usuario }
		} catch (error: any) {
			return {
				success: false,
				error: error.data?.message || 'Cadastro falhou',
			}
		}
	}

	async function logout() {
		try {
			const token = localStorage.getItem('token')
			if (token) {
				await $fetch('/api/auth/logout', {
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` },
				})
			}
		} finally {
			clearAuth()
		}
	}

	async function checkAuth() {
		try {
			const token = localStorage.getItem('token')
			if (!token) return false

			const resposta = await $fetch<CheckResponse>(
				'/api/auth/check',
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			setToken(token)
			setUsuario(resposta.usuario)
			return true
		} catch {
			clearAuth()
			return false
		} finally {
			state.value.carregando = false
		}
	}
})
