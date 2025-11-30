<template>
  <footer class="bg-gray-800 text-white mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg font-semibold mb-4">
            À propos
          </h3>
          <p class="text-gray-400">
            Application e-commerce construite avec Sylius et Nuxt.
          </p>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">
            Liens utiles
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="text-gray-400 hover:text-white">
                Accueil
              </NuxtLink>
            </li>
            
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">
            Contact
          </h3>
          <p class="text-gray-400">
            Email: contact@example.com
          </p>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Sylius Nuxt. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>
