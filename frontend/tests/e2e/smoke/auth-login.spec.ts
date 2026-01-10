import { expect, test } from '@playwright/test'
import { AuthHelper } from '../../helpers/auth'

/**
 * 🔥 SMOKE TESTS - Critical Authentication Flow
 *
 * Tests critiques qui doivent TOUJOURS passer sur master.
 * Exécutés à chaque commit sur main/master.
 *
 * RÈGLES :
 * - Uniquement happy path (pas d'edge cases)
 * - Rapides (< 2 minutes total)
 * - Tolérance zéro aux échecs
 * - Pas de tests de validation (voir regression)
 */
test.describe('Auth Critical Flow @smoke @critical', () => {
  let authHelper: AuthHelper

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page)
  })

  /**
   * Test 1: Login basique après registration
   * Durée: ~30s
   */
  test('should successfully login after registration', async ({ page }) => {
    // Register and login
    await authHelper.registerAndLogin()

    // Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 })
  })

  /**
   * Test 2: Middleware redirect basique
   * Durée: ~10s
   */
  test('should redirect unauthenticated user to login', async ({ page }) => {
    // Try to access protected page without auth
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 5000 })

    // Check redirect parameter
    const url = new URL(page.url())
    expect(url.searchParams.get('redirect')).toBe('/dashboard')
  })
})
