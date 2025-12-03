import type { LoginCredentials, LoginResponse, RegisterData } from '~/types/auth'

/**
 * Service d'authentification - Appels API purs
 */

// Endpoints API
const API_ENDPOINTS = {
  LOGIN: '/api/v2/shop/customers/token',
  REGISTER: '/api/v2/shop/customers',
} as const

/**
 * Connexion utilisateur
 */
export const loginService = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return await $fetch<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: credentials,
  })
}

/**
 * Inscription utilisateur
 */
export const registerService = async (data: RegisterData): Promise<void> => {
  await $fetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/ld+json',
    },
    body: {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      subscribedToNewsletter: data.subscribedToNewsletter ?? false,
    },
  })
}
