<script setup lang="ts">
import { Button, Checkbox, FormLabel, Inputfield } from '~/components/shadcn'

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const handleSubmit = () => {
  console.log('handleSubmit LoginForm')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <!-- Email field -->
    <div>
      <FormLabel>Adresse email *</FormLabel>
      <div>
        <Inputfield
          name="email"
          v-model="form.email"
          type="email"
          placeholder="exemple@email.com"
          autocomplete="email"
        />
      </div>
     
    </div>

    <!-- Password field -->
    <div>
      <FormLabel>Mot de passe *</FormLabel>
      <div>
        <Inputfield
          name="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
        />
      </div>
     
    </div>

    <!-- Remember me checkbox -->
    <div class="flex items-center space-x-2">
      <Checkbox
        id="rememberMe"
        v-model:checked="form.rememberMe"
      />
       <FormLabel for="rememberMe">
        Se souvenir de moi
      </FormLabel>
    </div>

    <!-- Submit button -->
    <Button
      type="submit"
      size="lg"
      class="w-full"
    >
      <span>Se connecter</span>
      
    </Button>
  </form>
</template>