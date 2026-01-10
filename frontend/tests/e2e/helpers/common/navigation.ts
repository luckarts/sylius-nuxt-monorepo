import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Helper pour attendre qu'une page soit complètement chargée
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Helper pour naviguer vers une URL et attendre le chargement complet
 */
export async function navigateAndWait(page: Page, url: string): Promise<void> {
  await page.goto(url)
  await waitForPageLoad(page)
}

/**
 * Helper pour vérifier qu'on est sur une URL spécifique
 */
export async function expectCurrentUrl(page: Page, url: string | RegExp): Promise<void> {
  await expect(page).toHaveURL(url)
}

/**
 * Helper pour cliquer et attendre la navigation
 */
export async function clickAndWaitForNavigation(page: Page, selector: string): Promise<void> {
  await Promise.all([page.waitForNavigation(), page.click(selector)])
}

/**
 * Helper pour vérifier qu'un toast/notification est visible
 */
export async function expectToastMessage(page: Page, message: string | RegExp): Promise<void> {
  const toast = page.locator('.toast, [role="alert"], .notification')
  await expect(toast).toBeVisible({ timeout: 5000 })
  await expect(toast).toContainText(message)
}

/**
 * Helper pour attendre qu'un toast disparaisse
 */
export async function waitForToastToDisappear(page: Page): Promise<void> {
  const toast = page.locator('.toast, [role="alert"], .notification')
  await toast.waitFor({ state: 'hidden', timeout: 10000 })
}
