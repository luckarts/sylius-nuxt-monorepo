<script setup lang="ts">
import type { LoginCredentials } from '~/types/auth'

definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Connexion',
  description: 'Connectez-vous à votre compte Sylius',
})

const { login } = useAuth()
const loading = ref(false)
const handleLoginSubmit = async (credentials: LoginCredentials) => {
  loading.value = true
  try {
    await login(credentials)
    console.log('Login success')
  } catch (error) {
    console.log(error || 'An error occurred during login. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout
    brand-title="Sylius Shop"
    brand-subtitle="Discover amazing products on"
    brand-url="sylius.com"
  >
    <template #form>
      <div class="w-full max-w-md">
        <!-- Back button -->
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-12"
        >
          <Icon name="arrow-left" class="w-4 h-4" />
          <span class="text-sm">Back to Dashboard</span>
        </NuxtLink>

        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            Sign In
          </h1>
          <p class="text-gray-500">
            Enter your email and password to sign in!
          </p>
        </div>

        <LoginForm
          :loading="loading"
          @submit="handleLoginSubmit"
        />

        <div class="mt-4 text-center">
          Forgot Password?
        </div>

        <p class="mt-6 text-center text-sm text-gray-600">
          Not registered yet ?
          <NuxtLink
            to="/auth/register"
            class="font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            Create an account
          </NuxtLink>
        </p>

        <!-- Footer -->
        <div class="mt-12 text-center text-sm text-gray-500">
          <p>©2025 Sylius. All Rights Reserved.</p>
        </div>
      </div>
    </template>
  </AuthLayout>
</template>