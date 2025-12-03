import type { LoginCredentials, RegisterData } from '~/types/auth'

interface AuthResult {
  success: boolean
  error?: string
}

export function useAuth() {
  const authStore = useAuthStore()

  async function login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      await authStore.login(credentials)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      return {
        success: false,
        error: err.data?.message || err.message || 'Erreur de connexion',
      }
    }
  }

  async function register(data: RegisterData): Promise<AuthResult> {
    try {
      await authStore.register(data)
      return { success: true }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }
      return {
        success: false,
        error: err.data?.message || err.message || "Erreur lors de l'inscription",
      }
    }
  }

  const error = computed(() => authStore.error)

  return {
    login,
    register,
    error,
  }
}
