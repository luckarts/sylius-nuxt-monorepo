<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

interface Props {
  class?: HTMLAttributes['class']
  message?: string
}

const props = defineProps<Props>()

// Essayer d'utiliser le contexte s'il existe, sinon utiliser la prop
const fieldContext = inject<{ error?: { value?: { message?: string } }; formMessageId?: string }>(
  Symbol.for('form-field'),
  { error: undefined, formMessageId: undefined }
)

const body = computed(() => props.message || fieldContext.error?.value?.message)
</script>

<template>
  <p
    v-if="body"
    :id="fieldContext.formMessageId"
    :class="cn('text-sm font-medium text-destructive', props.class)"
  >
    {{ body }}
  </p>
</template>
