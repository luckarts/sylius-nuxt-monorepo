# 🛠️ Test Helpers

Utilitaires réutilisables pour les tests E2E.

## 📂 Organisation

```
helpers/
├── auth/              # Authentification
│   ├── login.ts       # Login, logout, register
│   └── types.ts       # Types et constantes
├── cart/              # Panier (à créer)
│   └── operations.ts  # Add, remove, update
├── checkout/          # Checkout (à créer)
│   └── flow.ts        # Workflow checkout
└── common/            # Utilitaires communs
    └── navigation.ts  # Navigation, toasts, etc.
```

## 📝 Utilisation

### Import depuis smoke/ (FLAT)

```typescript
// smoke/auth-login.spec.ts
import { loginHelper } from '../helpers/auth/login'
import { TEST_USERS } from '../helpers/auth/types'
import { expectToastMessage } from '../helpers/common/navigation'

test('should login', async ({ page }) => {
  await loginHelper(page, TEST_USERS.customer.email)
  await expectToastMessage(page, 'Welcome back')
})
```

### Import depuis regression/ (NESTED)

```typescript
// regression/auth/login-scenarios.spec.ts
import { loginHelper, expectLoginFailed } from '../../helpers/auth/login'
import { TEST_USERS, generateTestUser } from '../../helpers/auth/types'

test('should handle invalid credentials', async ({ page }) => {
  await expectLoginFailed(page, 'wrong@email.com', 'wrongpass')
})

test('should login with new user', async ({ page }) => {
  const newUser = generateTestUser()
  // ... register and login
})
```

## 🎯 Helpers Disponibles

### auth/login.ts

- `loginHelper(page, email, password?)` - Se connecter
- `registerHelper(page, userData)` - S'inscrire
- `logoutHelper(page)` - Se déconnecter
- `expectUserLoggedIn(page)` - Vérifier connexion
- `expectUserLoggedOut(page)` - Vérifier déconnexion
- `expectLoginFailed(page, email, password)` - Tester login invalide

### auth/types.ts

- `TEST_USERS` - Utilisateurs de test (admin, customer)
- `generateTestUser()` - Générer utilisateur unique
- `TEST_ADDRESS` - Adresse de test par défaut
- Types: `UserCredentials`, `UserData`, `Address`

### common/navigation.ts

- `waitForPageLoad(page)` - Attendre chargement page
- `navigateAndWait(page, url)` - Naviguer et attendre
- `expectCurrentUrl(page, url)` - Vérifier URL actuelle
- `clickAndWaitForNavigation(page, selector)` - Cliquer et naviguer
- `expectToastMessage(page, message)` - Vérifier toast
- `waitForToastToDisappear(page)` - Attendre disparition toast

## ➕ Créer un Nouveau Helper

### 1. Créer le dossier

```bash
mkdir -p helpers/cart
```

### 2. Créer le fichier

```typescript
// helpers/cart/operations.ts
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export async function addToCart(page: Page, productCode: string, quantity = 1) {
  await page.goto(`/products/${productCode}`)
  await page.fill('[name="quantity"]', quantity.toString())
  await page.click('button:has-text("Add to Cart")')
  await expect(page.locator('.toast')).toContainText('Added to cart')
}

export async function clearCart(page: Page) {
  await page.goto('/cart')
  const removeButtons = await page.locator('button:has-text("Remove")').all()
  for (const button of removeButtons) {
    await button.click()
  }
}
```

### 3. Utiliser dans les tests

```typescript
// regression/cart/add-remove.spec.ts
import { addToCart, clearCart } from '../../helpers/cart/operations'

test('should add product to cart', async ({ page }) => {
  await addToCart(page, 'product-123', 2)
  // ...
})
```

## 📋 Conventions

1. **Un helper = une action métier**
   - ✅ `loginHelper` - Action complète
   - ❌ `fillLoginForm` - Trop bas niveau

2. **Nommer en fonction de l'action**
   - ✅ `addToCart` - Verbe d'action
   - ❌ `cart` - Trop vague

3. **Exporter les types séparément**
   - ✅ `auth/types.ts` - Types dans fichier dédié
   - ❌ `auth/login.ts` - Types mélangés avec helpers

4. **Documenter avec JSDoc**
   ```typescript
   /**
    * Helper pour se connecter
    *
    * @param page - Page Playwright
    * @param email - Email utilisateur
    * @param password - Mot de passe (défaut: 'password')
    *
    * @example
    * await loginHelper(page, 'customer@example.com')
    */
   ```

## ⚠️ Quand Créer un Helper ?

### ✅ CRÉER un helper si :
- L'action est utilisée **3+ fois**
- L'action est **complexe** (>5 lignes)
- L'action sera **réutilisée** dans d'autres features

### ❌ NE PAS créer de helper si :
- L'action n'est utilisée qu'**une seule fois**
- L'action est **triviale** (1 ligne)
- L'action est **spécifique** à un seul test

## 📊 Maintenance

### Refactoring

Quand un helper devient trop complexe (>100 lignes), le diviser :

```typescript
// Avant
helpers/auth/login.ts (150 lignes)

// Après
helpers/auth/
├── login.ts      (50 lignes)
├── register.ts   (50 lignes)
└── password.ts   (50 lignes)
```

### Suppression

Si un helper n'est plus utilisé :

```bash
# Chercher les usages
grep -r "loginHelper" tests/e2e/

# Si aucun usage, supprimer
rm helpers/auth/login.ts
```
