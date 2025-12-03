import { loginService, registerService } from '~/api/auth'
import type { LoginCredentials, RegisterData } from '~/types/auth'

interface AuthResult {
  success: boolean
  error?: string
}

/**
 * Composable d'authentification - Gère toute la logique métier
 * Utilise les services API et met à jour le store
 */
export function useAuth() {
  const authStore = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  /**
   * Connexion utilisateur
   */
  async function login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Appel au service API
      const response = await loginService(credentials)

      // Mise à jour du store
      authStore.setToken(response.token)

      await router.push('/dashboard')

      // Toast de succès
      toast({
        title: 'Bienvenue !',
        description: 'Connexion réussie',
        variant: 'success',
      })

      return { success: true }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string; statusCode?: number }

      // Gestion des erreurs métier
      let errorMessage = 'Erreur de connexion'

      if (err.statusCode === 401) {
        errorMessage = 'Identifiants invalides'
      } else if (err.statusCode === 429) {
        errorMessage = 'Trop de tentatives, réessayez plus tard'
      } else {
        errorMessage = err.data?.message || err.message || errorMessage
      }

      // Toast d'erreur
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

  /**
   * Inscription utilisateur
   */
  async function register(data: RegisterData): Promise<AuthResult> {
    try {
      // Appel au service API
      await registerService(data)

      // Toast de succès
      toast({
        title: 'Inscription réussie',
        description:
          'Un email de confirmation a été envoyé à votre adresse. Merci de valider votre compte',
        variant: 'success',
      })

      return { success: true }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string; statusCode?: number }

      // Gestion des erreurs métier
      let errorMessage = "Erreur lors de l'inscription"

      if (err.statusCode === 422) {
        errorMessage = 'Email déjà utilisé ou données invalides'
      } else {
        errorMessage = err.data?.message || err.message || errorMessage
      }

      // Toast d'erreur
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

  const token = computed(() => authStore.token)

  return {
    // Actions
    login,
    register,
    token,
  }
}
