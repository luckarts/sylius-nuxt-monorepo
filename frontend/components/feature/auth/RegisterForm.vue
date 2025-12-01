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
  submit: [
    data: {
      email: string
      password: string
      firstName: string
      lastName: string
      phoneNumber: string
      subscribedToNewsletter: boolean
    },
  ]
  success: []
  error: [error: Error]
}>()

// Configuration des champs du formulaire
const fields: FormField[] = [
  {
    name: 'firstName',
    label: 'Prénom *',
    type: 'text',
    placeholder: 'Jean',
    autocomplete: 'given-name',
    col: 'half',
    rules: [required('Le prénom est requis')],
  },
  {
    name: 'lastName',
    label: 'Nom *',
    type: 'text',
    placeholder: 'Dupont',
    autocomplete: 'family-name',
    col: 'half',
    rules: [required('Le nom est requis')],
  },
  {
    name: 'email',
    label: 'Email *',
    type: 'email',
    placeholder: 'jean.dupont@example.com',
    autocomplete: 'email',
    col: 'half',
    rules: [required("L'email est requis"), email('Email invalide')],
  },
  {
    name: 'phoneNumber',
    label: 'Téléphone',
    type: 'tel',
    placeholder: '+33 6 12 34 56 78',
    autocomplete: 'tel',
    col: 'half',
  },
  {
    name: 'password',
    label: 'Mot de passe *',
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'new-password',
    description: 'Minimum 8 caractères',
    rules: [required('Le mot de passe est requis'), min(8, 'Minimum 8 caractères')],
  },
  {
    name: 'passwordConfirm',
    label: 'Confirmer le mot de passe *',
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'new-password',
    matchField: 'password',
    matchFieldError: 'Les mots de passe ne correspondent pas',
    rules: [required('Veuillez confirmer le mot de passe')],
  },
  {
    name: 'subscribedToNewsletter',
    label: "S'abonner à la newsletter",
    type: 'checkbox',
    checked: false,
  },
]
const handleSubmit = (values: FormValues) => {
  //validation in FormBuilder
  // Émettre les données validées vers le parent

  emit('submit', {
    email: values.email as string,
    password: values.password as string,
    firstName: values.firstName as string,
    lastName: values.lastName as string,
    phoneNumber: values.phoneNumber as string,
    subscribedToNewsletter: values.subscribedToNewsletter as boolean,
  })
}
</script>

<template>
  <FormBuilder
    :fields="fields"
    :loading="loading"
    submit-label="S'inscrire"
    @submit="handleSubmit"
  />
</template>