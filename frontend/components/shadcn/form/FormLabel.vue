<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Label } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

interface Props {
  class?: HTMLAttributes['class']
  error?: boolean
  for?: string
}

const props = defineProps<Props>()

// Essayer d'utiliser le contexte s'il existe, sinon utiliser la prop
const fieldContext = inject<{ error?: { value?: { message?: string } }; formItemId?: string }>(
  Symbol.for('form-field'),
  { error: undefined, formItemId: undefined }
)

const hasError = computed(() => props.error || !!fieldContext.error?.value)
</script>

<template>
  <Label
    :for="props.for || fieldContext.formItemId"
    :class="cn(hasError && 'text-destructive', props.class)"
  >
    <slot />
  </Label>
</template>