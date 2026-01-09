import type { Page } from '@playwright/test'
import { MailpitHelper } from './mailpit'

/**
 * Helper pour l'authentification dans les tests E2E
 */
export class AuthHelper {
  private mailpit: MailpitHelper

  constructor(private page: Page) {
    this.mailpit = new MailpitHelper()
  }

  /**
   * Crée un nouvel utilisateur et le connecte
   * @param options - Options pour la création du compte
   * @returns Les credentials de l'utilisateur créé
   */
  async registerAndLogin(options?: {
    email?: string
    password?: string
    firstName?: string
    lastName?: string
    phoneNumber?: string
  }) {
    const timestamp = Date.now()
    const credentials = {
      email: options?.email || `test.user.${timestamp}@example.com`,
      password: options?.password || 'SecurePass123!',
      firstName: options?.firstName || 'Test',
      lastName: options?.lastName || 'User',
      phoneNumber: options?.phoneNumber || '+33 6 12 34 56 78',
    }

    // Registration
    await this.page.goto('/auth/register')
    await this.page.waitForLoadState('networkidle')

    // Attendre explicitement que les champs soient interactifs (important pour Firefox)
    const firstNameInput = this.page.getByLabel(/^prénom|^first name/i)
    await firstNameInput.waitFor({ state: 'visible', timeout: 10000 })
    await firstNameInput.fill(credentials.firstName)

    await this.page.getByLabel(/^nom(?! de)|^last name/i).fill(credentials.lastName)
    await this.page.getByLabel(/email/i).fill(credentials.email)
    await this.page.getByLabel(/téléphone|phone/i).fill(credentials.phoneNumber)

    const passwordFields = this.page.getByLabel(/mot de passe|password/i)
    await passwordFields.first().fill(credentials.password)
    await passwordFields.last().fill(credentials.password)

    await this.page.getByRole('button', { name: /s'inscrire|sign up/i }).click()

    // Attendre la fin de l'inscription
    await this.page.waitForTimeout(2000)

    // Email verification (required by Sylius before login)
    await this.verifyEmail(credentials.email)

    // Login
    await this.page.goto('/auth/login')
    await this.page.waitForLoadState('networkidle')

    // Attendre explicitement que les champs soient interactifs (important pour Firefox)
    const emailInput = this.page.getByLabel(/email/i)
    await emailInput.waitFor({ state: 'visible', timeout: 10000 })
    await emailInput.fill(credentials.email)

    const passwordInput = this.page.getByLabel(/mot de passe|password/i)
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 })
    await passwordInput.fill(credentials.password)

    await this.page.getByRole('button', { name: /se connecter|sign in|login/i }).click()

    // Attendre la redirection
    await this.page.waitForTimeout(2000)

    return credentials
  }

  /**
   * Vérifie l'email d'un utilisateur via Mailpit et l'endpoint Sylius
   * @param email - Email de l'utilisateur à vérifier
   */
  private async verifyEmail(email: string) {
    // Attendre l'email de vérification
    const verificationEmail = await this.mailpit.waitForMessage(
      (msg) => msg.To.some((to) => to.Address === email),
      30000
    )

    if (!verificationEmail) {
      throw new Error(`Email de vérification non reçu pour ${email}`)
    }

    // Extraire le token de vérification
    const token = this.mailpit.extractToken(verificationEmail, 'verify')

    if (!token) {
      throw new Error(`Token de vérification non trouvé dans l'email pour ${email}`)
    }

    // Vérifier l'email en appelant l'endpoint Sylius
    const verifyUrl = `http://nginx-proxy/fr_FR/verify/${token}`
    await this.page.request.get(verifyUrl, {
      maxRedirects: 0,
      failOnStatusCode: false,
      timeout: 30000,
    })

    // Attendre que Sylius traite la vérification
    await this.page.waitForTimeout(1000)
  }

  /**
   * Effectue uniquement le login (si l'utilisateur existe déjà)
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   */
  async login(email: string, password: string) {
    await this.page.goto('/auth/login')
    await this.page.waitForLoadState('networkidle')

    await this.page.getByLabel(/email/i).fill(email)
    await this.page.getByLabel(/mot de passe|password/i).fill(password)

    await this.page.getByRole('button', { name: /se connecter|sign in|login/i }).click()

    // Attendre la redirection
    await this.page.waitForTimeout(2000)
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  async isAuthenticated(): Promise<boolean> {
    // Vérifier si le cookie auth_token existe
    const cookies = await this.page.context().cookies()
    return cookies.some((cookie) => cookie.name === 'auth_token' && cookie.value)
  }

  /**
   * Déconnexion (efface les cookies)
   */
  async logout() {
    await this.page.context().clearCookies()
  }
}
