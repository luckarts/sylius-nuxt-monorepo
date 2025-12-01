<script setup lang="ts">
import { Button, Checkbox, FormLabel, Inputfield } from '~/components/shadcn'

const form = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  subscribedToNewsletter: false,
})

const handleSubmit = () => {
  console.log('handleSubmit REgisterForm')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <!-- Name fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <FormLabel>Prénom *</FormLabel>
        <div>
          <Inputfield
            name="firstName"
            v-model="form.firstName"
            type="text"
            placeholder="Jean"
            autocomplete="given-name"
          />
        </div>
      </div>

      <div>
        <FormLabel>Nom *</FormLabel>
        <div>
          <Inputfield
            name="lastName"
            v-model="form.lastName"
            type="text"
            placeholder="Dupont"
            autocomplete="family-name"
          />
        </div>
      </div>
    </div>

    <!-- Email -->
    <div>
      <FormLabel>Email *</FormLabel>
      <div>
        <Inputfield
          name="email"
          v-model="form.email"
          type="email"
          placeholder="jean.dupont@example.com"
          autocomplete="email"
        />
      </div>
      
    </div>

    <!-- Phone -->
    <div>
      <FormLabel>Téléphone</FormLabel>
      <div>
        <Inputfield
          name="phoneNumber"
          v-model="form.phoneNumber"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          autocomplete="tel"
        />
      </div>
      
    </div>

    <!-- Password -->
    <div>
      <FormLabel>Mot de passe *</FormLabel>
      <div>
        <Inputfield
          name="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
        />
      </div>
     
    </div>

    <!-- Password Confirmation -->
    <div>
      <FormLabel>Confirmer le mot de passe *</FormLabel>
      <div>
        <Inputfield
          name="passwordConfirm"
          v-model="form.passwordConfirm"
          type="password"
          placeholder="••••••••"
          autocomplete="new-password"
        />
      </div>
     
    </div>

    <!-- Newsletter -->
    <div class="flex items-center space-x-2">
      <Checkbox
        id="newsletter"
        v-model:checked="form.subscribedToNewsletter"
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