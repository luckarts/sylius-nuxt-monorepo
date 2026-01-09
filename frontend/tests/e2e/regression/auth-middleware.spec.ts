import { expect, test } from '@playwright/test'
import { AuthHelper } from '../../helpers/auth'

/**
 * 🔄 REGRESSION TESTS - Middleware & Redirect Flow
 *
 * Tests complets du middleware d'authentification et des redirections.
 * Vérifie la protection des pages et les flux de redirection.
 *
 * RÈGLES :
 * - Tests de tous les cas de middleware
 * - Durée acceptable (~3 min)
 * - Couvre les redirections et protections
 */
test.describe('Middleware & Redirect Flow @regression @middleware', () => {
  let authHelper: AuthHelper

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page)
  })

  test('should redirect unauthenticated user to login when accessing protected page', async ({
    page,
  }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard')

    // Wait for redirect
    await page.waitForLoadState('networkidle')

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/auth\/login/)

    // Check that redirect query parameter is present
    const url = new URL(page.url())
    expect(url.searchParams.get('redirect')).toBe('/dashboard')
  })

  test('should redirect to originally requested page after successful login', async ({ page }) => {
    // Register a new user
    const timestamp = Date.now()
    const testEmail = `test.redirect.${timestamp}@example.com`
    const testPassword = 'SecurePass123!'

    await page.goto('/auth/register')
    await page.getByLabel(/^prénom|^first name/i).fill('Test')
    await page.getByLabel(/^nom(?! de)|^last name/i).fill('User')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/téléphone|phone/i).fill('+33 6 12 34 56 78')

    const passwordFields = page.getByLabel(/mot de passe|password/i)
    await passwordFields.first().fill(testPassword)
    await passwordFields.last().fill(testPassword)
    await page.getByRole('button', { name: /s'inscrire|sign up/i }).click()
    await page.waitForTimeout(2000)

    // Try to access protected page
    await page.goto('/dashboard')

    // Should redirect to login with redirect param
    await expect(page).toHaveURL(/\/auth\/login\?redirect=/)

    // Login
    await authHelper.login(testEmail, testPassword)

    // Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('should redirect to default dashboard when no redirect param present after login', async ({
    page,
  }) => {
    await authHelper.registerAndLogin()
    await expect(page).toHaveURL('/dashboard')
  })

  test('should allow authenticated user to access protected pages', async ({ page }) => {
    await authHelper.registerAndLogin()
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })
})
