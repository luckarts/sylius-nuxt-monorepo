/**
 * Middleware d'authentification
 * Protège les routes qui nécessitent une connexion
 *
 * Usage dans une page :
 * definePageMeta({
 *   middleware: 'auth'
 * })
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Vérifier si l'utilisateur est authentifié
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})
