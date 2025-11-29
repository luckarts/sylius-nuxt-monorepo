# Sylius Nuxt Monorepo

Application e-commerce moderne construite avec Nuxt 3 et Sylius.

## 🚀 Stack Technique

### Frontend
- **Framework**: [Nuxt 3](https://nuxt.com/) - Framework Vue.js fullstack
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Composants UI réutilisables
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- **Linting**: ESLint - Analyse statique du code
- **i18n**: Internationalisation (FR/EN)

### Backend
- **API**: [Sylius](https://sylius.com/) - Plateforme e-commerce PHP

### DevOps & Testing
- **Containerization**: Docker - Conteneurisation de l'application
- **CI/CD**: Pipelines d'intégration et déploiement continus
- **E2E Testing**: [Cypress](https://www.cypress.io/) - Tests end-to-end

## 📋 Prérequis

- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose
- PHP >= 8.1 (pour Sylius)

## 🛠️ Installation

### Cloner le projet

```bash
git clone <repository-url>
cd sylius-nuxt-monorepo
```

### Configuration du Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
```

Configurer les variables d'environnement dans `.env`:

```env
NUXT_PUBLIC_API_URL=http://localhost:8000/api/v2
```

### Démarrer le projet

#### Avec Docker (recommandé)

```bash
docker-compose up -d
```

#### En local

```bash
# Frontend
cd frontend
pnpm dev

# Backend (Sylius)
cd backend
composer install
php bin/console server:run
```

## 🧪 Tests

### Tests E2E avec Cypress

```bash
cd frontend

# Mode interactif
pnpm cypress:open

# Mode headless
pnpm cypress:run
```

### Linting

```bash
cd frontend

# Vérifier le code
pnpm lint

# Corriger automatiquement
pnpm lint:fix
```

## 🏗️ Structure du Projet

```
.
├── frontend/              # Application Nuxt 3
│   ├── assets/           # Assets (CSS, images)
│   ├── components/       # Composants Vue
│   ├── layouts/          # Layouts Nuxt
│   ├── pages/            # Pages et routes
│   ├── i18n/             # Traductions
│   ├── lib/              # Utilitaires
│   └── cypress/          # Tests E2E
├── backend/              # API Sylius
├── .github/              # GitHub Actions workflows
└── docker-compose.yml    # Configuration Docker
```

## 🚢 CI/CD

Le projet utilise GitHub Actions pour l'intégration continue :

- ✅ Linting automatique (ESLint)
- ✅ Tests E2E (Cypress)
- ✅ Build de production
- ✅ Déploiement automatique

Les workflows se trouvent dans `.github/workflows/`.

## 🎨 Développement

### Ajouter un composant shadcn

```bash
cd frontend
npx shadcn-vue@latest add <component-name>
```

### Convention de code

- ESLint pour la qualité du code
- Tailwind CSS pour le styling
- Composition API Vue 3
- TypeScript strict mode

## 📦 Build de Production

```bash
cd frontend

# Build optimisé
pnpm build

# Prévisualiser le build
pnpm preview
```

## 🐳 Docker

### Services disponibles

- **frontend**: Application Nuxt (port 3000)
- **backend**: API Sylius (port 8000)
- **db**: Base de données PostgreSQL/MySQL

### Commandes Docker utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Rebuild les images
docker-compose build --no-cache
```

## 🌍 Internationalisation

Le projet supporte plusieurs langues :

- 🇫🇷 Français (fr-FR)
- 🇬🇧 Anglais (en-US)

Les traductions se trouvent dans `frontend/i18n/locales/`.

## 📝 Scripts Disponibles

### Frontend

```bash
pnpm dev          # Démarrer le serveur de développement
pnpm build        # Build de production
pnpm preview      # Prévisualiser le build
pnpm lint         # Vérifier le code
pnpm lint:fix     # Corriger le code
pnpm cypress:open # Ouvrir Cypress
pnpm cypress:run  # Exécuter les tests E2E
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

## 🔗 Liens Utiles

- [Documentation Nuxt 3](https://nuxt.com/docs)
- [Documentation Sylius](https://docs.sylius.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cypress Documentation](https://docs.cypress.io/)

## 📧 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.
