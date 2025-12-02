import type { Toast, ToastOptions } from '~/types/toast'

export const useToast = () => {
  // État global partagé entre toutes les instances
  const toasts = useState<Toast[]>('toasts', () => [])

  const toast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(7)
    const duration = options.duration ?? 5000

    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant ?? 'default',
      duration,
    }

    toasts.value.push(newToast)

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  const dismiss = (id: string) => {
    //chercher la position du toast avec cet id
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
    //si il existe
    if (index !== -1) {
      //supprime le toast à cette position
      toasts.value.splice(index, 1)
    }
  }

  const dismissAll = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    toast,
    dismiss,
    dismissAll,
  }
}
