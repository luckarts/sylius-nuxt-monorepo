# Testing Emails with Mailpit

Ce guide explique comment tester les emails dans les tests E2E en utilisant Mailpit.

## 🚀 Quick Start

### Lancer Mailpit localement

```bash
# Avec Docker
docker run -d -p 8025:8025 -p 1025:1025 --name mailpit axllent/mailpit

# Ou avec docker-compose
docker-compose -f docker-compose.e2e.yml up mailpit
```

Accédez à l'interface web : http://localhost:8025

### Lancer les tests

```bash
# Tests locaux (nécessite Mailpit sur localhost:8025)
pnpm test:e2e

# Tests dans Docker (utilise le service mailpit du docker-compose)
docker-compose -f docker-compose.e2e.yml --profile test up
```

## 📧 Utilisation dans les tests

### Import du helper

```typescript
import { MailpitHelper } from '../helpers/mailpit'

let mailpit: MailpitHelper

test.beforeEach(async () => {
  mailpit = new MailpitHelper()
  await mailpit.clearMessages() // Nettoyer avant chaque test
})
```

### Vérifier qu'un email a été envoyé

```typescript
const email = await mailpit.waitForMessage(
  (msg) => msg.To.some(to => to.Address === 'test@example.com'),
  15000 // timeout 15 secondes
)

expect(email).not.toBeNull()
expect(email?.Subject).toContain('Welcome')
```

### Vérifier le contenu de l'email

```typescript
// Vérifier le destinataire
expect(email?.To[0].Address).toBe('user@example.com')

// Vérifier l'expéditeur
expect(email?.From.Address).toBe('noreply@myapp.com')

// Vérifier le sujet
expect(email?.Subject).toMatch(/verify|welcome/i)

// Vérifier le contenu HTML
expect(email?.HTML).toContain('Click here to verify')

// Vérifier le contenu texte (fallback)
expect(email?.Text).toContain('Verify your email')
```

### Extraire un lien de l'email

```typescript
const verificationLink = mailpit.extractLink(
  email!,
  /(https?:\/\/[^\s"'<>]+\/verify[^\s"'<>]*)/i
)

expect(verificationLink).not.toBeNull()

// Naviguer vers le lien
await page.goto(verificationLink!)
```

### Vérifier plusieurs emails

```typescript
// Récupérer tous les messages
const messages = await mailpit.getMessages()
expect(messages).toHaveLength(3)

// Récupérer le dernier message
const latestEmail = await mailpit.getLatestMessage()

// Récupérer par sujet
const welcomeEmail = await mailpit.getMessageBySubject('Welcome')

// Récupérer par destinataire
const userEmail = await mailpit.getMessageByRecipient('user@example.com')
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Local | Docker |
|----------|-------|--------|
| `MAILPIT_URL` | `http://localhost:8025` | `http://mailpit:8025` |

La variable est automatiquement définie :
- **Localement** : via `.env.test`
- **Docker** : via `docker-compose.e2e.yml`

### Fichiers de configuration

- **Helper Mailpit** : `tests/helpers/mailpit.ts`
- **Config Playwright** : `playwright.config.ts`
- **Docker Compose** : `docker-compose.e2e.yml`
- **Variables d'environnement** : `.env.test`

## 📝 Bonnes pratiques

### 1. Toujours nettoyer avant chaque test

```typescript
test.beforeEach(async () => {
  await mailpit.clearMessages()
})
```

### 2. Utiliser des emails uniques

```typescript
const timestamp = Date.now()
const testEmail = `test-${timestamp}@example.com`
```

### 3. Utiliser waitForMessage avec timeout

```typescript
// ✅ BON : Attendre avec timeout
const email = await mailpit.waitForMessage(predicate, 15000)

// ❌ MAUVAIS : Attendre sans timeout
await page.waitForTimeout(5000)
const email = await mailpit.getLatestMessage()
```

### 4. Vérifier plusieurs aspects de l'email

```typescript
// Vérifier l'existence
expect(email).not.toBeNull()

// Vérifier le destinataire
expect(email?.To[0].Address).toBe(expectedEmail)

// Vérifier le sujet
expect(email?.Subject).toContain('Expected Subject')

// Vérifier le contenu
expect(email?.HTML).toContain('Expected Content')
```

### 5. Gérer les cas où l'email n'arrive pas

```typescript
const email = await mailpit.waitForMessage(predicate, 10000)

if (!email) {
  console.error('❌ Email not received')
  console.log('📬 Available emails:', await mailpit.getMessages())
}

expect(email).not.toBeNull()
```

## 🐛 Debugging

### Afficher tous les emails reçus

```typescript
const messages = await mailpit.getMessages()
console.log('📧 Emails received:', messages.length)
messages.forEach(msg => {
  console.log(`  - To: ${msg.To[0].Address}`)
  console.log(`  - Subject: ${msg.Subject}`)
})
```

### Afficher le contenu HTML de l'email

```typescript
console.log('📄 Email HTML:', email?.HTML)
```

### Accéder à l'interface web Mailpit

Ouvrez http://localhost:8025 dans votre navigateur pour voir tous les emails interceptés.

## 🔍 API Mailpit

Le helper utilise l'API REST de Mailpit :

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/messages` | Liste tous les messages |
| `GET /api/v1/message/{id}` | Détails d'un message |
| `DELETE /api/v1/messages` | Supprimer tous les messages |

Documentation complète : https://github.com/axllent/mailpit

## 📚 Exemples de tests

Voir `tests/e2e/auth.spec.ts` pour des exemples complets :
- `should send verification email after successful registration`
- `should verify email content and structure`

## ❓ FAQ

### Mailpit ne démarre pas dans Docker

```bash
# Vérifier que le port 8025 est libre
lsof -i :8025

# Relancer le service
docker-compose -f docker-compose.e2e.yml restart mailpit
```

### Les emails n'arrivent pas dans les tests

1. Vérifiez que Mailpit est bien démarré : http://localhost:8025
2. Vérifiez la configuration SMTP du backend Sylius : `MAILER_DSN=smtp://mailpit:1025`
3. Vérifiez les logs Mailpit : `docker-compose -f docker-compose.e2e.yml logs mailpit`

### Les tests passent localement mais échouent dans Docker

Vérifiez que `MAILPIT_URL` est correctement définie dans `docker-compose.e2e.yml` :

```yaml
environment:
  MAILPIT_URL: "http://mailpit:8025"
```

## 🎯 Tests à écrire

- [x] Vérification d'email après inscription
- [x] Vérification du contenu et de la structure de l'email
- [ ] Vérification d'email après reset de mot de passe
- [ ] Vérification d'email de confirmation de commande
- [ ] Vérification d'email de bienvenue
