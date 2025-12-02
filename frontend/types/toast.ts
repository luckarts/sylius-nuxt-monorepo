export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  duration: number
}
