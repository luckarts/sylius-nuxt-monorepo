/**
 * Barrel export pour helpers/auth
 * Permet d'importer depuis '../../helpers/auth' au lieu de '../../helpers/auth/login'
 */

// Export fonctions helpers
export * from './login'

// Export types et constantes
export * from './types'

// Export classe AuthHelper pour compatibilité
// Si vous préférez une approche orientée classe
import type { Page } from '@playwright/test'
import { loginHelper, logoutHelper, registerHelper } from './login'
import type { UserData } from './types'
import { generateTestUser } from './types'

/**
 * Classe AuthHelper pour une approche orientée objet
 *
 * @example
 * const authHelper = new AuthHelper(page)
 * await authHelper.registerAndLogin()
 */
export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Register et login automatique avec un utilisateur généré
   */
  async registerAndLogin(): Promise<UserData> {
    const userData = generateTestUser()
    await registerHelper(this.page, userData)

    // Après registration, on est déjà sur /login, on peut login directement
    await loginHelper(this.page, userData.email, userData.password)

    return userData
  }

  /**
   * Login avec credentials existants
   */
  async login(email: string, password?: string): Promise<void> {
    await loginHelper(this.page, email, password)
  }

  /**
   * Register avec données personnalisées
   */
  async register(userData: UserData): Promise<void> {
    await registerHelper(this.page, userData)
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await logoutHelper(this.page)
  }
}
