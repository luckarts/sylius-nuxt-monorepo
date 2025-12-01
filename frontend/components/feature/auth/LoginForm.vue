<script setup lang="ts">
import { Button, Checkbox, FormLabel, Inputfield } from '~/components/shadcn'
import { email, min, required, useField } from '~/composables/useFieldValidation'

// Champs de formulaire
const emailField = useField('', [required("L'email est requis"), email('Email invalide')])

const passwordField = useField('', [
  required('Le mot de passe est requis'),
  min(8, 'Minimum 8 caractères'),
])

const rememberMe = ref(false)

const handleSubmit = () => {
  // Valider tous les champs
  const isValid = [emailField, passwordField].every((field) => field.validate())

  if (isValid) {
    console.log('vamlid')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <!-- Email field -->
    <div>
      <FormLabel for="login-email" :error="!!emailField.error.value">
        Adresse email *
      </FormLabel>
      <Inputfield
        id="login-email"
        name="email"
        v-model="emailField.value.value"
        type="email"
        placeholder="exemple@email.com"
        autocomplete="email"
        :error="!!emailField.error.value"
        @blur="emailField.touch()"
      />
      
      <FormMessage :message="emailField.error.value" />
    </div>

    <!-- Password field -->
    <div>
      <FormLabel for="login-password" :error="!!passwordField.error.value">
        Mot de passe *
      </FormLabel>
      <Inputfield
        id="login-password"
        name="password"
        v-model="passwordField.value.value"
        type="password"
        placeholder="••••••••"
        autocomplete="current-password"
        :error="!!passwordField.error.value"
        @blur="passwordField.touch()"
      />
      
      <FormMessage :message="passwordField.error.value" />
    </div>

    <!-- Remember me checkbox -->
    <div class="flex items-center space-x-2">
      <Checkbox
        id="rememberMe"
        v-model:checked="rememberMe"
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