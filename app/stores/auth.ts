interface User {
	id: string
	email: string
	name: string
}

interface AuthState {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	loading: boolean
}

export const useAuthStore = defineStore('auth', () => {
	const state = ref<AuthState>({
		user: null,
		token: null,
		isAuthenticated: false,
		loading: true,
	})

	function setUser(user: AuthState['user']) {
		state.value.user = user
		state.value.isAuthenticated = true
	}

	function setToken(newToken: string) {
		state.value.token = newToken
		localStorage.setItem('token', newToken)
	}

	function clearAuth() {
		state.value.user = null
		state.value.token = null
		state.value.isAuthenticated = false
		localStorage.removeItem('token')
	}

	async function login(email: string, password: string) {
		try {
			const resposta = await $fetch<any>('/api/auth/login', {
				method: 'POST',
				body: { email, password },
			})

			setToken(resposta.token)
			setUser(resposta.user)
			return true
		} catch (error) {
			console.error('Login failed:', error)
			return false
		}
	}

	async function cadastro(nome: string, email: string, senha: string) {
		try {
			const resposta = await $fetch<any>('/api/auth/cadastro', {
				method: 'POST',
				body: { nome, email, senha },
			})

			// Automatically log in after signup
			setToken(resposta.token)
			setUser(resposta.user)
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

			const response = await $fetch<any>('/api/auth/check', {
				headers: { Authorization: `Bearer ${token}` },
			})

			setToken(token)
			setUser(response.user)
			return true
		} catch {
			clearAuth()
			return false
		} finally {
			state.value.loading = false
		}
	}
})
