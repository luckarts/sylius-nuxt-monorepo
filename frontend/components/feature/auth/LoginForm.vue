<script setup lang="ts">
import { email, min, required } from '~/composables/useFieldValidation'
import type { FormField, FormValues } from '~/types/form'

interface Props {
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string; rememberMe: boolean }]
}>()

// Configuration des champs du formulaire
const fields: FormField[] = [
  {
    name: 'email',
    label: 'Adresse email *',
    type: 'email',
    placeholder: 'exemple@email.com',
    autocomplete: 'email',
    rules: [required("L'email est requis"), email('Email invalide')],
  },
  {
    name: 'password',
    label: 'Mot de passe *',
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'current-password',
    rules: [required('Le mot de passe est requis'), min(8, 'Minimum 8 caractères')],
  },
  {
    name: 'rememberMe',
    label: 'Se souvenir de moi',
    type: 'checkbox',
    checked: false,
  },
]

const handleSubmit = (values: FormValues) => {
  // Validation déjà effectuée par FormBuilder
  // Émettre les données validées vers le parent
  emit('submit', {
    email: values.email as string,
    password: values.password as string,
    rememberMe: values.rememberMe as boolean,
  })
}
</script>

<template>
  <FormBuilder
    :fields="fields"
    :loading="loading"
    submit-label="Se connecter"
    @submit="handleSubmit"
  />
</template>