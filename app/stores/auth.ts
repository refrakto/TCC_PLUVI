interface AuthState {
	usuario: UsuarioSeguro | null
	token: string | null
	Autenticado: boolean
	carregando: boolean
}

export const useAuthStore = defineStore('auth', () => {
	const state = ref<AuthState>({
		usuario: null,
		token: null,
		Autenticado: false,
		carregando: true,
	})

	function setUsuario(usuario: AuthState['usuario']) {
		state.value.usuario = usuario
		state.value.Autenticado = true
	}

	function setToken(newToken: string) {
		state.value.token = newToken
		localStorage.setItem('token', newToken)
	}

	function clearAuth() {
		state.value.usuario = null
		state.value.token = null
		state.value.Autenticado = false
		localStorage.removeItem('token')
	}

	async function login(email: string, password: string) {
		try {
			const resposta = await $fetch<any>('/api/auth/login', {
				method: 'POST',
				body: { email, password },
			})

			setToken(resposta.token)
			setUsuario(resposta.user)
			return true
		} catch (error) {
			console.error('Login failed:', error)
			return false
		}
	}

	async function cadastro(nome: string, email: string, senha: string) {
		try {
			const resposta = await $fetch<Cadastro>('/api/auth/cadastro', {
				method: 'POST',
				body: { nome, email, senha },
			})

			// Automatically log in after signup
			setToken(resposta.token)
			setUsuario(resposta.usuario)
			return { success: true }
		} catch (error: any) {
			return {
				success: false,
				error: error.data?.message || 'Signup failed',
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

			const response = await $fetch<{ usuario: UsuarioSeguro }>(
				'/api/auth/check',
				{ headers: { Authorization: `Bearer ${token}` } }
			)

			setToken(token)
			setUsuario(response.usuario)
			return true
		} catch {
			clearAuth()
			return false
		} finally {
			state.value.carregando = false
		}
	}
})
