<script setup lang="ts">
import { cva } from 'class-variance-authority'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'

import { cn } from '~/lib/utils'
import type { Toast } from '~/types/toast'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success:
          'border-green-500 bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-100',
        warning:
          'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
        info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface Props {
  toast: Toast
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const emit = defineEmits<{
  dismiss: [id: string]
}>()

const classes = computed(() => cn(toastVariants({ variant: props.toast.variant }), props.class))

const handleDismiss = () => {
  emit('dismiss', props.toast.id)
}
</script>

<template>
  <div
    :class="classes"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="grid gap-1 flex-1">
      <div v-if="toast.title" class="text-sm font-semibold">
        {{ toast.title }}
      </div>
      <div v-if="toast.description" class="text-sm opacity-90">
        {{ toast.description }}
      </div>
    </div>
    <button
      type="button"
      class="absolute right-2 top-2 rounded-md p-1 opacity-100 hover:opacity-80 transition-opacity"
      @click="handleDismiss"
    >
      <Icon name="x" :size="16" :variant="toast.variant" />
    </button>
  </div>
</template>