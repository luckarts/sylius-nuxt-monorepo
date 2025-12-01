<script setup lang="ts">
import { icons } from '~/lib/icons'
import type { IconName as CustomIconName } from '~/lib/icons'
import { iconRegistry } from '~/lib/lucide-icons'
import type { IconName as LucideIconName } from '~/lib/lucide-icons'
import { cn } from '~/lib/utils'

/*
 exemple     <Icon name="arrow-left" class="w-4 h-4" />
 exemple     <Icon name="x" variant="destructive" />

 Priority:
 1. LucideIcon (from lucide-vue-next)
 2. Custom icons (social media, outline variants)
 */

type IconVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

interface Props {
  name: LucideIconName | CustomIconName
  size?: string | number
  class?: string
  variant?: IconVariant
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  class: '',
  variant: 'default',
})

// Check if icon exists in Lucide registry first
const lucideIcon = computed(() => {
  return iconRegistry[props.name as LucideIconName]
})

// Fallback to custom SVG icons
const customIconData = computed(() => {
  if (!lucideIcon.value) {
    const data = icons[props.name as CustomIconName]
    if (!data) {
      console.warn(`Icon "${props.name}" not found in Lucide or custom icons`)
    }
    return data
  }
  return null
})

const computedSize = computed(() => {
  return typeof props.size === 'number' ? props.size : Number.parseInt(props.size as string) || 24
})

// Gestion des couleurs selon la variante
const variantClasses = computed(() => {
  const baseClasses = props.class

  const variantColors = {
    default: 'text-current',
    destructive: 'text-white',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }

  return cn(variantColors[props.variant], baseClasses)
})
</script>

<template>
  <!-- Lucide Icon (priority) -->
  <component
    :is="lucideIcon"
    v-if="lucideIcon"
    :size="computedSize"
    :class="variantClasses"
    aria-hidden="true"
  />

  <!-- Custom SVG Icon (fallback) -->
  <svg
    v-else-if="customIconData"
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="customIconData.viewBox"
    :width="computedSize"
    :height="computedSize"
    :class="variantClasses"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="customIconData.path" />
  </svg>
</template>