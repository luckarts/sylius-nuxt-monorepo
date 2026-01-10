# Test Helpers

Helpers utilitaires pour les tests E2E avec Playwright.

## 📧 MailpitHelper

Helper pour interagir avec Mailpit (serveur SMTP de test).

### Utilisation

```typescript
import { MailpitHelper } from '../helpers/mailpit'

const mailpit = new MailpitHelper('http://mailpit:8025')

// Attendre un email
const email = await mailpit.waitForMessage(
  (msg) => msg.To.some(to => to.Address === 'test@example.com'),
  15000
)

// Extraire un token depuis l'email
const token = mailpit.extractToken(email!, 'verify')
```

### Méthodes disponibles

- `getMessages()` : Récupère tous les messages (métadonnées)
- `getMessageById(id)` : Récupère le contenu complet d'un message
- `getLatestMessage()` : Récupère le dernier message avec contenu complet
- `getMessageByRecipient(email)` : Récupère un message par destinataire
- `getMessageBySubject(subject)` : Récupère un message par sujet
- `extractToken(message, urlPattern)` : Extrait un token depuis une URL dans l'email
- `clearMessages()` : Supprime tous les messages
- `waitForMessage(predicate, timeout)` : Attend qu'un email arrive

## 🗄️ DatabaseHelper

Helper pour interroger directement la base de données PostgreSQL de Sylius.

### Utilisation

```typescript
import { DatabaseHelper } from '../helpers/database'

const db = new DatabaseHelper()
await db.connect()

try {
  // Vérifier si un utilisateur existe
  const exists = await db.userExists('test@example.com')

  // Vérifier si l'email est vérifié
  const isVerified = await db.isEmailVerified('test@example.com')

  // Récupérer les informations complètes
  const userInfo = await db.getUserInfo('test@example.com')
  console.log(userInfo)
} finally {
  await db.disconnect()
}
```

### Méthodes disponibles

- `connect()` : Se connecte à la base de données
- `disconnect()` : Se déconnecte de la base de données
- `userExists(email)` : Vérifie si un utilisateur existe
- `isEmailVerified(email)` : Vérifie si l'email est vérifié (token = null)
- `getUserInfo(email)` : Récupère toutes les infos d'un utilisateur
- `getVerificationToken(email)` : Récupère le token de vérification
- `countUsers()` : Compte le nombre total d'utilisateurs
- `cleanupTestUsers(emailPattern)` : Nettoie les utilisateurs de test

### Configuration

Les variables d'environnement sont configurées dans `docker-compose.e2e.yml` :

```yaml
environment:
  POSTGRES_DB: "sylius_e2e"
  POSTGRES_USER: "sylius"
  POSTGRES_PASSWORD: "sylius_password"
```

### Structure de la table `sylius_shop_user`

Colonnes principales :
- `id` : ID de l'utilisateur
- `username` : Email de l'utilisateur
- `email_verification_token` : Token de vérification (null si vérifié)
- `enabled` : Compte activé (boolean)
- `verified_at` : Date de vérification
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

## 🎯 Exemple complet

```typescript
test('should register and verify email', async ({ page }) => {
  const testEmail = `test.${Date.now()}@example.com`

  // Setup helpers
  const mailpit = new MailpitHelper()
  const db = new DatabaseHelper()

  // 1. Register user
  await page.goto('/auth/register')
  // ... remplir le formulaire ...

  // 2. Wait for verification email
  const email = await mailpit.waitForMessage(
    (msg) => msg.To.some(to => to.Address === testEmail)
  )

  // 3. Extract token
  const token = mailpit.extractToken(email!, 'verify')

  // 4. Visit verification URL
  await page.goto(`http://sylius/fr_FR/verify/${token}`)

  // 5. Verify in database
  await db.connect()
  try {
    const isVerified = await db.isEmailVerified(testEmail)
    expect(isVerified).toBe(true)
  } finally {
    await db.disconnect()
  }

  // 6. Test login
  await page.goto('/auth/login')
  // ... test login ...
})
```

## 🔧 Troubleshooting

### Connexion à la base de données échoue

Vérifier que :
1. Le container PostgreSQL est bien démarré
2. Les variables d'environnement sont correctes
3. Le network Docker permet la communication

### Email non trouvé dans Mailpit

Vérifier que :
1. Mailpit est accessible sur `http://mailpit:8025`
2. Sylius est configuré pour envoyer les emails à Mailpit
3. Le délai d'attente (timeout) est suffisant

### Token non extrait de l'email

Vérifier que :
1. L'email contient bien une URL avec le pattern demandé
2. Le format de l'URL correspond à la regex (avec ou sans locale)
3. Le token est bien présent dans l'URL
