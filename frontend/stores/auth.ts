import { defineStore } from 'pinia'

interface AuthState {
  token: string | null
}

/**
 * Store d'authentification - État global uniquement
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    // 🔄 Hydratation : Restaurer le token depuis le cookie au démarrage
    const tokenCookie = useCookie<string | null>('auth_token')

    return {
      token: tokenCookie.value || null,
    }
  },

  getters: {
    /**
     * Vérifie si l'utilisateur est authentifié
     */
    isAuthenticated: (state): boolean => !!state.token,
  },

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

    /**
     * Efface l'authentification (token et cookie)
     */
    clearAuth() {
      this.token = null

      // Supprimer le cookie
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
    },
  },
})
