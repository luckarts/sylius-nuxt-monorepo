import { defineStore } from 'pinia'
import type { LoginCredentials, LoginResponse, RegisterData } from '~/types/auth'

interface AuthState {
  token: string | null
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    error: null,
  }),

  getters: {},

  actions: {
    /**
     * Connexion utilisateur
     */
    async login(credentials: LoginCredentials): Promise<void> {
      this.error = null

      try {
        const response = await $fetch<LoginResponse>('/api/v2/shop/customers/token', {
          method: 'POST',
          body: credentials,
        })

        this.token = response.token

        // Stocker le token dans un cookie
        const tokenCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 jours
          secure: true,
          sameSite: 'strict',
        })
        tokenCookie.value = response.token
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string }
        const errorMessage = error.data?.message || error.message || 'Identifiants invalides'
        this.error = errorMessage

        throw err
      }
    },

    /**
     * Inscription utilisateur
     */
    async register(data: RegisterData): Promise<void> {
      this.error = null

      try {
        await $fetch('/api/v2/shop/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/ld+json',
          },
          body: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            subscribedToNewsletter: data.subscribedToNewsletter ?? false,
          },
        })
      } catch (err: unknown) {
        const error = err as { data?: { message?: string }; message?: string }
        const errorMessage = error.data?.message || error.message || "Erreur lors de l'inscription"
        this.error = errorMessage

        throw err
      }
    },
  },
})
