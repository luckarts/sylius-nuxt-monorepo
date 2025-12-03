<script setup lang="ts">
import { Button } from '~/components/shadcn/button'

const authStore = useAuthStore()
const router = useRouter()

// Navigation pour les utilisateurs non connectés
const navigation = [
  { name: 'Login', href: '/auth/login' },
  { name: 'Register', href: '/auth/register' },
]

// Navigation pour les utilisateurs connectés
const privatedNavigation = [{ name: 'Dashboard', href: '/dashboard' }]

// Vérifier si l'utilisateur est authentifié
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Fonction de déconnexion
const handleLogout = async () => {
  authStore.clearAuth()
  await router.push('/auth/login')
}
</script>

<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-primary">
          Sylius Nuxt
        </NuxtLink>

        <!-- Navigation non connecté -->
        <ul v-if="!isAuthenticated" class="flex items-center gap-6 list-none">
          <li v-for="item in navigation" :key="item.href">
            <NuxtLink
              :to="item.href"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>

        <!-- Navigation connecté -->
        <div v-else class="flex items-center gap-6">
          <ul class="flex items-center gap-6 list-none">
            <li v-for="item in privatedNavigation" :key="item.href">
              <NuxtLink
                :to="item.href"
                class="text-gray-600 hover:text-primary transition-colors"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>

          <!-- Bouton de déconnexion -->
          <Button
            @click="handleLogout"
            variant="destructive"
            size="sm"
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </nav>
  </header>
</template>
