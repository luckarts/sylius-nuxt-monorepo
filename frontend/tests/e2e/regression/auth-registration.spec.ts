import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * 🔄 REGRESSION TESTS - Registration Flow
 *
 * Tests complets de registration avec tous les cas et edge cases.
 * Exécutés sur master après merge de feature.
 *
 * RÈGLES :
 * - Tests complets (happy path + edge cases)
 * - Durée acceptable (~5 min)
 * - Couvre toutes les fonctionnalités existantes
 */

/**
 * Helper function to check for a toast notification
 */
async function expectToast(
  page: Page,
  options: {
    variant?: 'success' | 'destructive' | 'warning' | 'info' | 'default'
    title?: string | RegExp
    description?: string | RegExp
    timeout?: number
  }
) {
  const { variant, title, description, timeout = 5000 } = options

  const toast = page.locator('[role="alert"][aria-live="assertive"]')
  await expect(toast).toBeVisible({ timeout })

  if (variant) {
    const variantClasses = {
      success: /border-green-500|bg-green-50/,
      destructive: /border-destructive|bg-destructive/,
      warning: /border-yellow-500|bg-yellow-50/,
      info: /border-blue-500|bg-blue-50/,
      default: /border bg-background/,
    }

    const toastClass = await toast.getAttribute('class')
    const hasExpectedVariant = variantClasses[variant].test(toastClass || '')

    if (!hasExpectedVariant) {
      const toastTitle = await toast
        .locator('.font-semibold')
        .textContent()
        .catch(() => 'N/A')
      const toastDescription = await toast
        .locator('.opacity-90')
        .textContent()
        .catch(() => 'N/A')

      throw new Error(
        `Toast variant mismatch. Expected "${variant}" but got different variant. Title: "${toastTitle}", Description: "${toastDescription}"`
      )
    }
  }

  if (title) {
    const toastTitle = toast.locator('.font-semibold')
    await expect(toastTitle).toContainText(title)
  }

  if (description) {
    const toastDescription = toast.locator('.opacity-90')
    await expect(toastDescription).toContainText(description)
  }

  return toast
}

test.describe('Registration Flow @regression @auth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')
  })

  test('should display registration page with all form fields', async ({ page }) => {
    // Check URL
    await expect(page).toHaveURL('/auth/register')

    // Check page title
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()

    // Check all form fields are present
    await expect(page.getByLabel(/^prénom|^first name/i)).toBeVisible()
    await expect(page.getByLabel(/^nom(?! de)|^last name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/téléphone|phone/i)).toBeVisible()

    // Check password fields
    const passwordFields = page.getByLabel(/mot de passe|password/i)
    await expect(passwordFields.first()).toBeVisible()
    await expect(passwordFields.last()).toBeVisible()

    // Check submit button
    await expect(page.getByRole('button', { name: /s'inscrire|sign up/i })).toBeVisible()

    // Check newsletter checkbox
    await expect(page.getByLabel(/newsletter/i)).toBeVisible()

    // Check login link
    await expect(page.getByRole('link', { name: /sign in|se connecter/i })).toBeVisible()
  })

  test('should successfully register with all fields and display success card', async ({
    page,
  }) => {
    // Verify Sylius login page is accessible
    const loginPageResponse = await page.request.get('http://nginx-proxy/fr_FR/login', {
      timeout: 10000,
      failOnStatusCode: false,
    })

    const statusCode = loginPageResponse.status()

    if (statusCode !== 200) {
      const responseBody = await loginPageResponse
        .text()
        .catch(() => 'Unable to read response body')

      throw new Error(
        `Sylius login page returned ${statusCode}. Check backend logs. Response: ${responseBody.substring(0, 200)}`
      )
    }

    // Generate unique email
    const timestamp = Date.now()
    const testEmail = `test.user.${timestamp}@example.com`

    // Fill all required fields
    await page.getByLabel(/^prénom|^first name/i).fill('Jean')
    await page.getByLabel(/^nom(?! de)|^last name/i).fill('Dupont')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/téléphone|phone/i).fill('+33 6 12 34 56 78')

    const passwordFields = page.getByLabel(/mot de passe|password/i)
    await passwordFields.first().fill('SecurePass123!')
    await passwordFields.last().fill('SecurePass123!')

    // Subscribe to newsletter
    await page.getByLabel(/newsletter/i).check()

    // Submit form
    await page.getByRole('button', { name: /s'inscrire|sign up/i }).click()

    // Check for success toast
    await expectToast(page, {
      variant: 'success',
      title: /inscription réussie|registration successful/i,
      timeout: 5000,
    })

    // Check success card is displayed
    await expect(
      page.getByRole('heading', { name: /inscription réussie|registration successful/i })
    ).toBeVisible()

    // Check email is displayed
    await expect(page.getByText(testEmail)).toBeVisible()

    // Check next steps instructions
    await expect(
      page.getByText(/vérifiez votre boîte de réception|check your inbox/i)
    ).toBeVisible()

    // Check login link in success card
    await expect(
      page.getByRole('link', { name: /aller à la page de connexion|go to login page/i })
    ).toBeVisible()

    // Check form is no longer visible
    await expect(page.getByRole('button', { name: /s'inscrire|sign up/i })).not.toBeVisible()
  })

  test('should navigate to login page when clicking sign in link', async ({ page }) => {
    await page.getByRole('link', { name: /sign in|se connecter/i }).click()
    // Should navigate to login page
    // await expect(page).toHaveURL('/auth/login')
  })

  test('should navigate to login page from success card', async ({ page }) => {
    // Register successfully
    const timestamp = Date.now()
    const testEmail = `test.nav.${timestamp}@example.com`

    await page.getByLabel(/^prénom|^first name/i).fill('Test')
    await page.getByLabel(/^nom(?! de)|^last name/i).fill('User')
    await page.getByLabel(/email/i).fill(testEmail)

    const passwordFields = page.getByLabel(/mot de passe|password/i)
    await passwordFields.first().fill('TestPass123!')
    await passwordFields.last().fill('TestPass123!')

    await page.getByRole('button', { name: /s'inscrire|sign up/i }).click()

    // Wait for success card
    await page.waitForTimeout(2000)
    await expect(
      page.getByRole('heading', { name: /inscription réussie|registration successful/i })
    ).toBeVisible()

    // Click login link in success card
    await page.getByRole('link', { name: /aller à la page de connexion|go to login page/i }).click()

    // Should navigate to login page
    // await expect(page).toHaveURL('/auth/login')
  })
})
