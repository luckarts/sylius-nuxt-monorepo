<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'Inscription',
  description: 'Créez votre compte Sylius',
})

const handleRegisterSubmit = async (data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  subscribedToNewsletter: boolean
}) => {
  console.log(data)
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
            Sign Up
          </h1>
          <p class="text-gray-500">
            Enter your details to create your account!
          </p>
        </div>

        <!-- Divider -->

        <!-- Register Form Component -->
        <RegisterForm
          @submit="handleRegisterSubmit"
        />

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account ?
          <NuxtLink
            to="/auth/login"
            class="font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            Sign in
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