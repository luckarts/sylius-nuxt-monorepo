<script setup lang="ts">
interface Props {
  showBranding?: boolean
  brandTitle?: string
  brandSubtitle?: string
  brandUrl?: string
}

withDefaults(defineProps<Props>(), {
  showBranding: true,
  brandTitle: 'Horizon UI',
  brandSubtitle: 'Learn more about Horizon UI on',
  brandUrl: 'horizon-ui.com',
})
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Form Section -->
    <div class="flex-1 flex items-start justify-center p-8 bg-white">
      <slot name="form" />
    </div>

    <!-- Branding Section -->
    <div
      v-if="showBranding"
      class="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700"
    >
      <div class="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
        <!-- Logo -->
        <div class="mb-8">
          <slot name="logo">
            <div class="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-2xl">
              <div class="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 20C60 31.0457 68.9543 40 80 40C68.9543 40 60 48.9543 60 60C60 48.9543 51.0457 40 40 40C51.0457 40 60 31.0457 60 20Z" fill="white"/>
                  <path d="M60 60C60 71.0457 68.9543 80 80 80C68.9543 80 60 88.9543 60 100C60 88.9543 51.0457 80 40 80C51.0457 80 60 71.0457 60 60Z" fill="white"/>
                </svg>
              </div>
            </div>
          </slot>
        </div>

        <!-- Brand Name -->
        <div class="mb-16 text-center">
          <h2 class="text-5xl font-bold mb-2">{{ brandTitle }}</h2>
        </div>

        <!-- CTA Box -->
        <div class="border-2 border-white/30 rounded-2xl px-16 py-8 backdrop-blur-sm">
          <p class="text-center text-lg mb-2">{{ brandSubtitle }}</p>
          <p class="text-center text-2xl font-bold">{{ brandUrl }}</p>
        </div>

        <!-- Footer Links -->
        <div class="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 text-sm font-medium">
          <slot name="footer-links">
            <a href="#" class="hover:underline transition-all">Support</a>
            <a href="#" class="hover:underline transition-all">License</a>
            <a href="#" class="hover:underline transition-all">Terms of Use</a>
            <a href="#" class="hover:underline transition-all">Blog</a>
          </slot>
        </div>

        <!-- Dark Mode Toggle -->
        <slot name="dark-mode-toggle">
          <button
            type="button"
            class="absolute bottom-12 right-12 w-12 h-12 rounded-full bg-indigo-800/50 hover:bg-indigo-800/70 backdrop-blur-sm flex items-center justify-center transition-colors"
            aria-label="Toggle dark mode"
          >
            <Icon name="moon" class="w-5 h-5" />
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>