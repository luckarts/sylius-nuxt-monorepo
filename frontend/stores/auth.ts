import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
}

/**
 * Store d'authentification - État global uniquement
 * La logique métier est dans le composable useAuth()
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
  }),

  getters: {},

  actions: {
    /**
     * Définit le token d'authentification
     */
    setToken(token: string) {
      this.token = token

      // Stocker le token dans un cookie
      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        secure: true,
        sameSite: 'strict',
      })
      tokenCookie.value = token
    },
  },
})
