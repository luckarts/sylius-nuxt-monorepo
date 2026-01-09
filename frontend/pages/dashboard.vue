<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Dashboard',
  description: 'Tableau de bord utilisateur',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card: Profile -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon name="user" class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                Mon Profil
              </h3>
              <p class="text-sm text-gray-500">
                Gérer mes informations
              </p>
            </div>
          </div>
          <NuxtLink
            to="/profile"
            class="mt-4 block text-center py-2 px-4 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
          >
            Voir mon profil
          </NuxtLink>
        </div>

        <!-- Card: Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="shopping-bag" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                Mes Commandes
              </h3>
              <p class="text-sm text-gray-500">
                Historique des achats
              </p>
            </div>
          </div>
          <NuxtLink
            to="/orders"
            class="mt-4 block text-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Voir mes commandes
          </NuxtLink>
        </div>

        <!-- Card: Shop -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="store" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                Boutique
              </h3>
              <p class="text-sm text-gray-500">
                Découvrir nos produits
              </p>
            </div>
          </div>
          <NuxtLink
            to="/products"
            class="mt-4 block text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Voir la boutique
          </NuxtLink>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Statistiques rapides
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">
              0
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Commandes totales
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">
              0€
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Montant dépensé
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">
              0
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Produits favoris
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
