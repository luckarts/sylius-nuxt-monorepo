export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  subscribedToNewsletter?: boolean
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  customer: Customer
}

export interface LoginResponse extends AuthResponse {}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  subscribedToNewsletter?: boolean
}

export interface AuthState {
  token: string | null
  refreshToken: string | null
  customer: Customer | null
  loading: boolean
  error: string | null
}
