# Guide d'utilisation E2E Testing - Sylius Nuxt Monorepo

> **Documentation complète** de l'environnement E2E unifié (local + GitHub Actions)

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Démarrage rapide](#démarrage-rapide)
- [Configuration](#configuration)
- [Utilisation locale](#utilisation-locale)
- [Utilisation CI/CD](#utilisation-cicd)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

L'environnement E2E est **unifié** entre développement local et CI/CD :
- ✅ **Un seul `docker-compose.e2e.yml`** pour local et GitHub Actions
- ✅ **Deux fichiers .env** : `.env.e2e.local` (dev) et `.env.e2e.ci` (CI)
- ✅ **Deux suites de fixtures** : `e2e_full` (local) et `e2e_minimal` (CI)
- ✅ **Détection automatique** de l'environnement (local vs CI)

### Services disponibles

| Service | Port Local | Description |
|---------|-----------|-------------|
| **Nuxt Frontend** | 3000 | Application Nuxt.js |
| **Sylius API** | 8000 | Backend Sylius (API + Shop) |
| **Mailpit** | 8025 | Interface emails de test |
| **PostgreSQL** | 5433 | Base de données |
| **Nginx Proxy** | 9000 | Proxy pour forcer Host: localhost |

---

## 🔧 Prérequis

### Logiciels requis

- **Docker** 20.10+ et **Docker Compose** 2.0+
- **Git**
- **Node.js 18+** et **npm** (pour builder les assets Sylius)

### Installation initiale

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd sylius-nuxt-monorepo
   ```

2. **Builder les assets Sylius** (une seule fois)
   ```bash
   cd backend
   npm install --legacy-peer-deps
   npm run build:prod
   cd ..
   ```

   > 💡 Les assets sont buildés dans `backend/public/build/` (ignorés par git)

3. **Vérifier que `.env.e2e.local` existe**
   ```bash
   ls -la .env.e2e.local
   ```

   Si le fichier n'existe pas, il sera créé automatiquement au premier lancement.

---

## 🚀 Démarrage rapide

### Local (développement)

```bash
# Démarrer l'environnement complet
./start-e2e.sh start

# Vérifier que tout fonctionne
./start-e2e.sh status

# Accéder aux services
open http://localhost:3000  # Frontend Nuxt
open http://localhost:8000  # Sylius Shop
open http://localhost:8025  # Mailpit (emails)
```

### GitHub Actions (CI)

Le workflow se déclenche automatiquement sur :
- Push vers `main`, `develop`, ou branches `feature/**`
- Pull requests vers `main` ou `develop`
- Déclenchement manuel (workflow_dispatch)

---

## ⚙️ Configuration

### Variables d'environnement

#### `.env.e2e.local` (développement local)

```bash
# Optimisé pour le dev local (rapide)
ROUTER_DEFAULT_URI=http://localhost:8000
FIXTURES_SUITE=e2e_full                    # 87 produits, 10 users
FRONTEND_START_PERIOD=30s                  # Timeout court
FRONTEND_RETRIES=5
DOCKERFILE_BACKEND=Dockerfile              # Pas de build assets
```

#### `.env.e2e.ci` (GitHub Actions)

```bash
# Optimisé pour CI/CD (stable)
ROUTER_DEFAULT_URI=http://nginx-proxy
FIXTURES_SUITE=e2e_minimal                 # 5 produits, 2 users
FRONTEND_START_PERIOD=120s                 # Timeout long (runners lents)
FRONTEND_RETRIES=15
DOCKERFILE_BACKEND=Dockerfile.e2e          # Pre-build assets
```

### Suites de fixtures

| Suite | Produits | Users | Commandes | Usage |
|-------|----------|-------|-----------|-------|
| **e2e_minimal** | 5 | 2 | 0 | CI/CD (rapide) |
| **e2e_full** | 20 | 10 | 5 | Local (complet) |

Fichier : `backend/config/packages/test/sylius_fixtures.yaml`

---

## 💻 Utilisation locale

### Script de gestion `./start-e2e.sh`

```bash
# Démarrer tous les services
./start-e2e.sh start

# Arrêter les services
./start-e2e.sh stop

# Redémarrer
./start-e2e.sh restart

# Nettoyer (supprime volumes et données)
./start-e2e.sh clean

# Voir les logs (tous les services)
./start-e2e.sh logs

# Voir les logs d'un service spécifique
./start-e2e.sh logs php
./start-e2e.sh logs nuxt

# Lancer les tests E2E (Firefox)
./start-e2e.sh test

# Afficher l'état des services
./start-e2e.sh status
```

### Commandes Docker Compose directes

```bash
# Démarrer avec .env.e2e.local
docker-compose -f docker-compose.e2e.yml --env-file .env.e2e.local up -d

# Voir les logs en temps réel
docker-compose -f docker-compose.e2e.yml logs -f

# Exécuter une commande dans le container PHP
docker-compose -f docker-compose.e2e.yml exec php sh

# Lancer les tests Playwright (Firefox uniquement)
docker-compose -f docker-compose.e2e.yml --profile test-firefox up --exit-code-from playwright-firefox

# Tout nettoyer (containers + volumes)
docker-compose -f docker-compose.e2e.yml down -v
```

### Workflow de développement

1. **Démarrer l'environnement**
   ```bash
   ./start-e2e.sh start
   ```

2. **Attendre que tous les services soient "healthy"** (~2-3 minutes)
   ```bash
   ./start-e2e.sh status
   ```

3. **Développer et tester**
   - Frontend : http://localhost:3000
   - API Sylius : http://localhost:8000/api/v2/shop/products
   - Emails : http://localhost:8025

4. **Lancer les tests E2E**
   ```bash
   cd frontend
   pnpm exec playwright test
   ```

5. **Arrêter quand terminé**
   ```bash
   ./start-e2e.sh stop
   ```

### Rebuilder les assets Sylius

Si tu modifies le code Sylius (templates, assets JS/CSS) :

```bash
cd backend
npm run build:prod
php bin/console cache:clear
cd ..
```

---

## 🤖 Utilisation CI/CD

### Workflow GitHub Actions

**Fichier** : `.github/workflows/e2e-tests.yml`

**Étapes principales :**

1. ✅ Checkout code
2. ✅ Setup Docker Buildx (cache)
3. ✅ Copier `.env.e2e.ci` → `.env`
4. ✅ Build Docker images (avec cache)
5. ✅ Démarrer services (avec healthchecks)
6. ✅ **Builder les assets Sylius** (npm install + build:prod)
7. ✅ Lancer tests Playwright (Firefox uniquement)
8. ✅ Upload artifacts (rapports, screenshots)
9. ✅ Cleanup

### Détection automatique de l'environnement

Le script `backend/docker-entrypoint-e2e.sh` détecte automatiquement l'environnement via `$CI` :

```bash
if [ "$CI" = "true" ]; then
    ENV_TYPE="CI/CD (GitHub Actions)"
    FIXTURES_SUITE="${FIXTURES_SUITE:-e2e_minimal}"  # Suite minimale
else
    ENV_TYPE="Local Development"
    FIXTURES_SUITE="${FIXTURES_SUITE:-e2e_full}"     # Suite complète
fi
```

### Variables d'environnement passées au container PHP

```yaml
environment:
  CI: "${CI:-false}"                              # Détection CI
  FIXTURES_SUITE: ${FIXTURES_SUITE:-e2e_full}     # Suite à charger
  ROUTER_DEFAULT_URI: ${ROUTER_DEFAULT_URI}       # URL Sylius
  # ... autres variables
```

### Optimisations CI

- **Cache Docker layers** : Utilise `actions/cache@v4`
- **Fixtures minimales** : `e2e_minimal` (5 produits au lieu de 20)
- **Timeouts augmentés** : Les runners GitHub sont plus lents
- **Firefox uniquement** : Pour accélérer (pas Chromium/WebKit)

---

## 🏗️ Architecture

### Stack technique

#### Backend (Sylius)
- **PHP 8.3** + **Symfony 6.4** + **Sylius 1.13**
- **PostgreSQL 15**
- **Nginx** (reverse proxy)
- **Mailpit** (SMTP test server)

#### Frontend (Nuxt)
- **Nuxt 3.15+** + **Vue 3.5+**
- **Playwright** (tests E2E)
- **Node.js 18+**

### Fichiers clés

```
sylius-nuxt-monorepo/
├── .env.e2e.local                     # Config développement local
├── .env.e2e.ci                        # Config GitHub Actions
├── docker-compose.e2e.yml             # Orchestration Docker (unifié)
├── start-e2e.sh                       # Script utilitaire local
├── scripts/e2e.sh                     # Script utilitaire alternatif
│
├── backend/
│   ├── Dockerfile                     # Image standard (pas de build assets)
│   ├── Dockerfile.e2e                 # Image CI avec assets pré-buildés
│   ├── docker-entrypoint-e2e.sh       # Entrypoint avec détection environnement
│   └── config/packages/test/
│       └── sylius_fixtures.yaml       # Fixtures e2e_minimal + e2e_full
│
├── frontend/
│   ├── Dockerfile.e2e                 # Image Nuxt pour E2E
│   └── tests/e2e/                     # Tests Playwright
│       ├── auth.spec.ts               # Tests authentification
│       ├── checkout.spec.ts           # Tests checkout
│       └── helpers/                   # Helpers (Mailpit, etc.)
│
└── .github/workflows/
    └── e2e-tests.yml                  # Workflow GitHub Actions
```

### Flow de démarrage

#### Local
```
1. ./start-e2e.sh start
2. Détecte environnement → Local
3. Crée .env.e2e.local si manquant
4. docker-compose up -d (avec .env.e2e.local)
5. PHP démarre → Détecte CI=false
6. Charge fixtures e2e_full (20 produits)
7. Services prêts ✅
```

#### GitHub Actions
```
1. Workflow trigger (push/PR)
2. Copie .env.e2e.ci → .env
3. docker-compose build (avec .env.e2e.ci)
4. docker-compose up -d
5. PHP démarre → Détecte CI=true
6. Charge fixtures e2e_minimal (5 produits)
7. Build assets Sylius (npm install + build:prod)
8. Lance tests Playwright
9. Upload artifacts ✅
```

---

## 🔍 Troubleshooting

### Problème : Suite de fixtures non trouvée

**Erreur :**
```
Suite with name "e2e_full" could not be found!
```

**Cause :** Fichier `backend/config/packages/test/sylius_fixtures.yaml` manquant ou mal configuré.

**Solution :**
```bash
# Vérifier que le fichier existe
ls -la backend/config/packages/test/sylius_fixtures.yaml

# Vérifier qu'il contient les deux suites
grep -A 2 "e2e_minimal\|e2e_full" backend/config/packages/test/sylius_fixtures.yaml
```

---

### Problème : Assets Sylius manquants (500 error)

**Erreur :**
```
Asset manifest file "/srv/sylius/public/build/shop/manifest.json" does not exist
```

**Cause :** Assets Sylius non buildés.

**Solution (local) :**
```bash
cd backend
npm install --legacy-peer-deps
npm run build:prod
cd ..
./start-e2e.sh restart
```

**Solution (CI) :** L'étape "Build Sylius assets" dans `.github/workflows/e2e-tests.yml` doit être présente.

---

### Problème : Base de données - duplicate key

**Erreur :**
```
ERROR: duplicate key value violates unique constraint "uniq_7ba1286477153098"
Key (code)=(fr_FR) already exists.
```

**Cause :** Fixtures chargées sans purger la base.

**Solution :**
Vérifier que `orm_purger: ~` est présent dans `sylius_fixtures.yaml` :
```yaml
sylius_fixtures:
    suites:
        e2e_minimal:
            listeners:
                orm_purger: ~  # ← Doit être présent
                logger: ~
```

---

### Problème : Services ne deviennent pas "healthy"

**Symptômes :**
- Timeout lors du démarrage
- Services en état "unhealthy"

**Diagnostics :**
```bash
# Voir l'état des services
./start-e2e.sh status

# Voir les logs d'un service
./start-e2e.sh logs php
./start-e2e.sh logs nuxt

# Tester manuellement les healthchecks
curl http://localhost:8000/api/v2/shop/products
curl http://localhost:3000
```

**Solutions courantes :**

1. **Augmenter les timeouts** (dans `.env.e2e.local`) :
   ```bash
   FRONTEND_START_PERIOD=60s
   FRONTEND_RETRIES=10
   ```

2. **Vérifier les logs PHP** pour erreurs de fixtures :
   ```bash
   docker-compose -f docker-compose.e2e.yml logs php --tail=100
   ```

3. **Rebuilder les images** si entrypoint script modifié :
   ```bash
   ./start-e2e.sh clean
   docker-compose -f docker-compose.e2e.yml build --no-cache php
   ./start-e2e.sh start
   ```

---

### Problème : Playwright - connexion refusée

**Erreur :**
```
connect() failed (111: Connection refused)
```

**Cause :** PHP-FPM pas encore démarré ou crashé.

**Solution :**
```bash
# Vérifier que PHP-FPM tourne
docker-compose -f docker-compose.e2e.yml exec php ps aux | grep php-fpm

# Voir les derniers logs PHP
docker-compose -f docker-compose.e2e.yml logs php --tail=50

# Redémarrer si nécessaire
./start-e2e.sh restart
```

---

### Problème : Erreurs réseau GitHub Actions

**Erreur :**
```
read tcp 10.1.0.173:45750->185.199.109.154:443: read: connection reset by peer
```

**Cause :** Problème réseau temporaire avec GitHub/Packagist.

**Solution :**
1. **Re-run le workflow** (bouton "Re-run all jobs")
2. Si ça persiste, ajouter des retries dans le workflow

---

### Problème : Docker Compose v1 vs v2

**Erreur :**
```
unknown shorthand flag: 'f' in -f
```

**Cause :** Le script utilise `docker compose` (v2) mais le système a `docker-compose` (v1).

**Solution :**
Tous les scripts utilisent maintenant `docker-compose` (avec tiret) pour compatibilité v1.

---

### Problème : Variables d'environnement non passées

**Symptômes :**
- En CI, détecte "Local Development" au lieu de "CI/CD"
- Mauvaise suite de fixtures chargée

**Solution :**
Vérifier que `CI` et `FIXTURES_SUITE` sont bien dans `docker-compose.e2e.yml` :
```yaml
php:
  environment:
    CI: "${CI:-false}"
    FIXTURES_SUITE: ${FIXTURES_SUITE:-e2e_full}
```

---

## 📚 Ressources

### Documentation complémentaire

- [E2E_UNIFIED_CONFIG.md](./E2E_UNIFIED_CONFIG.md) - Détails de configuration
- [DOCKER_ARCHITECTURE.md](./DOCKER_ARCHITECTURE.md) - Architecture Docker
- [E2E_SETUP.md](./E2E_SETUP.md) - Guide de setup initial
- [Sylius Fixtures Documentation](https://docs.sylius.com/en/latest/book/fixtures.html)
- [Playwright Documentation](https://playwright.dev/)

### Commandes utiles

```bash
# Voir toutes les fixtures disponibles
docker-compose -f docker-compose.e2e.yml exec php php bin/console sylius:fixtures:list

# Charger manuellement une suite de fixtures
docker-compose -f docker-compose.e2e.yml exec php php bin/console sylius:fixtures:load e2e_minimal

# Accéder au shell du container PHP
docker-compose -f docker-compose.e2e.yml exec php sh

# Exécuter une migration Doctrine
docker-compose -f docker-compose.e2e.yml exec php php bin/console doctrine:migrations:migrate

# Vider le cache Symfony
docker-compose -f docker-compose.e2e.yml exec php php bin/console cache:clear
```

---

## 🎉 Récapitulatif

✅ **Environnement unifié** : Un seul docker-compose pour local + CI
✅ **Détection automatique** : CI vs Local basé sur `$CI`
✅ **Fixtures optimisées** : Minimales en CI, complètes en local
✅ **Scripts pratiques** : `./start-e2e.sh` pour gérer l'environnement
✅ **Tests Playwright** : Firefox en CI, tous navigateurs en local
✅ **Documentation complète** : Ce guide + fichiers dans le repo

**Prêt à coder ! 🚀**
