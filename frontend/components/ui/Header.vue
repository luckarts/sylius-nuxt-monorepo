<script setup lang="ts">
const navigation = [
  { name: 'Login', href: '/auth/login' },
  { name: 'Register', href: '/auth/register' },
]
</script>

<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-primary">
          Sylius Nuxt
        </NuxtLink>

        <ul class="flex items-center gap-6 list-none">
          <li v-for="item in navigation" :key="item.href">
            <NuxtLink
              :to="item.href"
              class="text-gray-600 hover:text-primary transition-colors"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
