/**
 * Types et constantes pour les tests d'authentification
 */

export interface UserCredentials {
  email: string
  password: string
}

export interface UserData extends UserCredentials {
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface Address {
  street: string
  city: string
  postcode: string
  country: string
}

/**
 * Utilisateurs de test par défaut
 */
export const TEST_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'admin_password',
  },
  customer: {
    email: 'customer@example.com',
    password: 'customer_password',
  },
} as const

/**
 * Générateur d'utilisateur unique pour les tests
 */
export function generateTestUser(): UserData {
  const timestamp = Date.now()
  return {
    email: `test-${timestamp}@example.com`,
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User',
  }
}

/**
 * Adresse de test par défaut
 */
export const TEST_ADDRESS: Address = {
  street: '123 Test Street',
  city: 'Paris',
  postcode: '75001',
  country: 'FR',
}
