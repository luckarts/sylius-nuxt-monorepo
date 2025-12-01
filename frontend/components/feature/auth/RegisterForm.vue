<script setup lang="ts">
import { Button, Checkbox, FormLabel, Inputfield } from '~/components/shadcn'
import { email, min, required, useField } from '~/composables/useFieldValidation'

// Champs de formulaire
const emailField = useField('', [required("L'email est requis"), email('Email invalide')])

const passwordField = useField('', [
  required('Le mot de passe est requis'),
  min(8, 'Minimum 8 caractères'),
])

const passwordConfirmField = useField('', [
  required('Veuillez confirmer le mot de passe'),
  (val: string) => val === passwordField.value.value || 'Les mots de passe ne correspondent pas',
])

const firstNameField = useField('', [required('Le prénom est requis')])

const lastNameField = useField('', [required('Le nom est requis')])

const phoneField = useField('', [])

const subscribedToNewsletter = ref(false)

const handleSubmit = () => {
  // Valider tous les champs
  const isValid = [
    firstNameField,
    lastNameField,
    emailField,
    phoneField,
    passwordField,
    passwordConfirmField,
  ].every((field) => field.validate())

  if (isValid) {
    console.log('valid')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <!-- Name fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormLabel for="firstName" :error="!!firstNameField.error.value">
          Prénom *
        </FormLabel>
        <Inputfield
          id="firstName"
          name="firstName"
          v-model="firstNameField.value.value"
          type="text"
          placeholder="Jean"
          autocomplete="given-name"
          :error="!!firstNameField.error.value"
          @blur="firstNameField.touch()"
        />
        <FormMessage :message="firstNameField.error.value" />
      </div>

      <div>
        <FormLabel for="lastName" :error="!!lastNameField.error.value">
          Nom *
        </FormLabel>
        <Inputfield
          id="lastName"
          name="lastName"
          v-model="lastNameField.value.value"
          type="text"
          placeholder="Dupont"
          autocomplete="family-name"
          :error="!!lastNameField.error.value"
          @blur="lastNameField.touch()"
        />
        <FormMessage :message="lastNameField.error.value" />
      </div>
    </div>

    <!-- Email -->
    <div>
      <FormLabel for="email" :error="!!emailField.error.value">
        Email *
      </FormLabel>
      <Inputfield
        id="email"
        name="email"
        v-model="emailField.value.value"
        type="email"
        placeholder="jean.dupont@example.com"
        autocomplete="email"
        :error="!!emailField.error.value"
        @blur="emailField.touch()"
      />
     
      <FormMessage :message="emailField.error.value" />
    </div>

    <!-- Phone -->
    <div>
      <FormLabel for="phoneNumber" :error="!!phoneField.error.value">
        Téléphone
      </FormLabel>
      <Inputfield
        id="phoneNumber"
        name="phoneNumber"
        v-model="phoneField.value.value"
        type="tel"
        placeholder="+33 6 12 34 56 78"
        autocomplete="tel"
        :error="!!phoneField.error.value"
        @blur="phoneField.touch()"
      />
    
      <FormMessage :message="phoneField.error.value" />
    </div>

    <!-- Password -->
    <div>
      <FormLabel for="password" :error="!!passwordField.error.value">
        Mot de passe *
      </FormLabel>
      <Inputfield
        id="password"
        name="password"
        v-model="passwordField.value.value"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="!!passwordField.error.value"
        @blur="passwordField.touch()"
      />
     
      <FormMessage :message="passwordField.error.value" />
    </div>

    <!-- Password Confirmation -->
    <div>
      <FormLabel for="passwordConfirm" :error="!!passwordConfirmField.error.value">
        Confirmer le mot de passe *
      </FormLabel>
      <Inputfield
        id="passwordConfirm"
        name="passwordConfirm"
        v-model="passwordConfirmField.value.value"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="!!passwordConfirmField.error.value"
        @blur="passwordConfirmField.touch()"
      />
    
      <FormMessage :message="passwordConfirmField.error.value" />
    </div>

    <!-- Newsletter -->
    <div class="flex items-center space-x-2">
      <Checkbox
        id="newsletter"
        v-model:checked="subscribedToNewsletter"
      />
      <FormLabel for="newsletter">
        S'abonner à la newsletter
      </FormLabel>
    </div>

    <!-- Submit button -->
    <Button
      type="submit"
      size="lg"
      class="w-full"
    >
      <span >S'inscrire</span>
    </Button>
  </form>
</template>