import type { LoginCredentials, RegisterData } from '~/types/auth'

interface AuthResult {
  success: boolean
  error?: string
}

/**
 * Gère toute la logique métier d'authentification
 */
export function useAuth() {
  const authStore = useAuthStore()
  const { toast } = useToast()

  async function login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      await authStore.login(credentials)

      // Toast de succès
      toast({
        title: 'Bienvenue !',
        description: 'Connexion réussie',
        variant: 'success',
      })

      return { success: true }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }

      // Toast d'erreur
      const errorMessage = err.data?.message || err.message || 'Erreur de connexion'

      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      })

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async function register(data: RegisterData): Promise<AuthResult> {
    try {
      await authStore.register(data)

      // Toast de succès
      toast({
        title: 'Inscription réussie',
        description:
          'Un email de confirmation a été envoyé à votre adresse. Merci de valider votre compte',
        variant: 'success',
      })

      return { success: true }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string }

      // Toast d'erreur
      const errorMessage = err.data?.message || err.message || "Erreur lors de l'inscription"

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: 'destructive',
      })

      return {
        success: false,
        error: errorMessage,
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
