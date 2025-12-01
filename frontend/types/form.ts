/**
 * Types pour le FormBuilder
 */

export type ValidationRule = (value: string) => true | string

export type FieldType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'checkbox'

export interface FormField {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  autocomplete?: string
  rules?: ValidationRule[]
  disabled?: boolean
  class?: string
  // Pour checkbox
  checked?: boolean
  // Pour layout en colonnes
  col?: 'full' | 'half'
  // Description supplémentaire sous le champ
  description?: string
  // Pour validation inter-champs (ex: confirmation password)
  matchField?: string
  matchFieldError?: string
}

export interface FormBuilderProps {
  fields: FormField[]
  submitLabel?: string
  loading?: boolean
  class?: string
}

export interface FormValues {
  [key: string]: string | number | boolean
}

export interface FormErrors {
  [key: string]: string | null
}

export interface FormBuilderEmits {
  submit: [values: FormValues]
}
