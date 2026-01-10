import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import type { UserData } from './types'

/**
 * Helper pour se connecter avec email/password
 *
 * @example
 * await loginHelper(page, 'customer@example.com')
 * await loginHelper(page, TEST_USERS.customer.email, TEST_USERS.customer.password)
 */
export async function loginHelper(page: Page, email: string, password = 'password'): Promise<void> {
  await page.goto('/login')

  // Remplir le formulaire
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)

  // Soumettre
  await page.click('button[type="submit"]')

  // Attendre la redirection vers dashboard
  await page.waitForURL('/dashboard', { timeout: 10000 })

  // Vérifier que le login a réussi
  await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 5000 })
}

/**
 * Helper pour s'inscrire avec les données fournies
 *
 * @example
 * await registerHelper(page, {
 *   email: 'newuser@example.com',
 *   password: 'SecurePass123',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * })
 */
export async function registerHelper(page: Page, userData: UserData): Promise<void> {
  await page.goto('/register')

  // Remplir le formulaire
  await page.fill('input[name="email"]', userData.email)
  await page.fill('input[name="password"]', userData.password)

  if (userData.firstName) {
    await page.fill('input[name="firstName"]', userData.firstName)
  }

  if (userData.lastName) {
    await page.fill('input[name="lastName"]', userData.lastName)
  }

  // Soumettre
  await page.click('button[type="submit"]')

  // Attendre le message de succès ou la redirection
  const successCard = page.locator('.registration-success')
  await expect(successCard).toBeVisible({ timeout: 10000 })
}

/**
 * Helper pour se déconnecter
 *
 * @example
 * await logoutHelper(page)
 */
export async function logoutHelper(page: Page): Promise<void> {
  // Cliquer sur le bouton logout dans le header
  await page.click('button:has-text("Logout")')

  // Attendre la redirection vers la page de login
  await page.waitForURL('/login', { timeout: 5000 })

  // Vérifier qu'on est bien déconnecté
  await expect(page.locator('text=Sign in')).toBeVisible()
}

/**
 * Helper pour vérifier qu'un utilisateur est connecté
 *
 * @example
 * await expectUserLoggedIn(page)
 */
export async function expectUserLoggedIn(page: Page): Promise<void> {
  // Vérifier la présence d'un élément qui n'apparaît que pour les utilisateurs connectés
  await expect(page.locator('button:has-text("Logout")')).toBeVisible()
}

/**
 * Helper pour vérifier qu'un utilisateur est déconnecté
 *
 * @example
 * await expectUserLoggedOut(page)
 */
export async function expectUserLoggedOut(page: Page): Promise<void> {
  // Vérifier la présence d'un élément qui n'apparaît que pour les utilisateurs non connectés
  await expect(page.locator('a[href="/login"]')).toBeVisible()
}

/**
 * Helper pour tester un login invalide
 *
 * @example
 * await expectLoginFailed(page, 'wrong@example.com', 'wrongpass')
 */
export async function expectLoginFailed(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')

  // Vérifier le message d'erreur
  await expect(page.locator('.error, .toast-error')).toContainText(/invalid|incorrect/i)

  // Vérifier qu'on reste sur la page de login
  await expect(page).toHaveURL('/login')
}
