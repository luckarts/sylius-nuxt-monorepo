<script setup lang="ts">
import { Button, Checkbox, FormLabel, FormMessage, Inputfield } from '~/components/shadcn'
import { useField } from '~/composables/useFieldValidation'
import type { FormField, FormValues } from '~/types/form'

interface Props {
  fields: FormField[]
  submitLabel?: string
  loading?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  submitLabel: 'Soumettre',
  loading: false,
})

const emit = defineEmits<{
  submit: [values: FormValues]
}>()

// Créer les champs avec validation
const formFields = computed(() => {
  return props.fields.map((field) => {
    const initialValue =
      field.type === 'checkbox' ? ((field.checked || false) as unknown as string) : ''

    return {
      ...field,
      fieldState: useField(initialValue, field.rules || []),
    }
  })
})

// Exposer les valeurs des champs pour validation inter-champs
const getFieldValue = (fieldName: string) => {
  const field = formFields.value.find((f) => f.name === fieldName)
  return field?.fieldState.value.value || ''
}

// Fournir getFieldValue pour les règles de validation personnalisées
provide('getFieldValue', getFieldValue)

// Valider et soumettre
const handleSubmit = () => {
  // Valider tous les champs
  let isValid = formFields.value.every((field) => field.fieldState.validate())

  // Validation supplémentaire pour les champs avec matchField
  for (const field of formFields.value) {
    if (field.matchField) {
      const matchFieldValue = getFieldValue(field.matchField)
      if (field.fieldState.value.value !== matchFieldValue) {
        field.fieldState.error.value = field.matchFieldError || 'Les valeurs ne correspondent pas'
        isValid = false
      }
    }
  }

  if (isValid) {
    // Construire l'objet des valeurs
    const values: FormValues = {}
    for (const field of formFields.value) {
      values[field.name] = field.fieldState.value.value
    }

    emit('submit', values)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" novalidate :class="props.class">
    <div class="space-y-6">
      <!-- Générer les champs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <template v-for="field in formFields" :key="field.name">
          <!-- Checkbox -->
          <div
            v-if="field.type === 'checkbox'"
            :class="field.col === 'half' ? '' : 'md:col-span-2'"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="field.name"
              :checked="!!field.fieldState.value.value"
              @update:checked="(val: boolean) => field.fieldState.value.value = val as any"
              :disabled="loading || field.disabled"
            />
            <FormLabel :for="field.name">
              {{ field.label }}
            </FormLabel>
          </div>

          <!-- Input fields -->
          <div
            v-else
            :class="field.col === 'half' ? '' : 'md:col-span-2'"
            class="space-y-2"
          >
            <FormLabel
              :for="field.name"
              :error="!!field.fieldState.error.value"
            >
              {{ field.label }}
            </FormLabel>
            <Inputfield
              :id="field.name"
              :name="field.name"
              v-model="field.fieldState.value.value"
              :type="field.type"
              :placeholder="field.placeholder"
              :disabled="loading || field.disabled"
              :autocomplete="field.autocomplete"
              :error="!!field.fieldState.error.value"
              :class="field.class"
              @blur="field.fieldState.touch()"
            />
           
            <FormMessage
              v-if="field.fieldState.error.value"
              :message="field.fieldState.error.value"
            />
          </div>
        </template>
      </div>

      <!-- Submit button -->
      <Button
        type="submit"
        size="lg"
        :disabled="loading"
        class="mt-2 w-full"
      >
        <span v-if="!loading">{{ submitLabel }}</span>
        <span v-else class="flex items-center gap-2">
          <Icon name="loader-circle" :size="16" class="animate-spin" />
          Chargement...
        </span>
      </Button>
    </div>
  </form>
</template>