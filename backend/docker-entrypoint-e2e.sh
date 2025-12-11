#!/bin/sh
set -e
set -o pipefail  # Propager les erreurs dans les pipes

echo "🚀 Démarrage de Sylius E2E..."

#############################################
# Détection automatique de l'environnement
#############################################
if [ "$CI" = "true" ]; then
    ENV_TYPE="CI/CD (GitHub Actions)"
    FIXTURES_SUITE="${FIXTURES_SUITE:-e2e_minimal}"
else
    ENV_TYPE="Local Development"
    FIXTURES_SUITE="${FIXTURES_SUITE:-e2e_full}"
fi

echo "📍 Environnement détecté : $ENV_TYPE"
echo "🌱 Suite de fixtures sélectionnée : $FIXTURES_SUITE"
echo "🔗 ROUTER_DEFAULT_URI : ${ROUTER_DEFAULT_URI}"

#############################################
# Créer .env depuis .env.test si nécessaire
#############################################
if [ ! -f .env ]; then
    echo "📝 Création de .env depuis .env.test..."
    cp .env.test .env
    echo "✅ Fichier .env créé"
fi

echo "📋 DATABASE_URL: ${DATABASE_URL}"

# Générer les clés JWT si elles n'existent pas
echo "🔑 Vérification des clés JWT..."
if [ ! -f config/jwt/private.pem ] || [ ! -f config/jwt/public.pem ]; then
    echo "🔐 Génération des clés JWT pour E2E..."
    mkdir -p config/jwt

    # Générer la clé privée avec la passphrase de test
    openssl genrsa -passout pass:"${JWT_PASSPHRASE:-e2e-test-passphrase}" -out config/jwt/private.pem 4096

    # Extraire la clé publique
    openssl rsa -pubout -passin pass:"${JWT_PASSPHRASE:-e2e-test-passphrase}" -in config/jwt/private.pem -out config/jwt/public.pem

    # Fixer les permissions pour que PHP-FPM puisse les lire
    chmod 644 config/jwt/private.pem config/jwt/public.pem

    echo "✅ Clés JWT générées avec succès !"
else
    echo "✅ Clés JWT déjà présentes"
    # Vérifier que les permissions sont correctes
    chmod 644 config/jwt/private.pem config/jwt/public.pem
fi

# Attendre que la base de données soit prête
echo "⏳ Attente de PostgreSQL..."
attempt=0
max_attempts=60

until php bin/console doctrine:query:sql "SELECT 1" > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo "❌ ERREUR: PostgreSQL n'est pas accessible après ${max_attempts} tentatives (2 minutes)"
        echo "🔍 Tentative de diagnostic:"
        php bin/console doctrine:query:sql "SELECT 1" 2>&1 || true
        exit 1
    fi
    echo "PostgreSQL n'est pas encore prêt - tentative $attempt/$max_attempts..."
    sleep 2
done
echo "✅ PostgreSQL est prêt !"

# Créer la base de données si elle n'existe pas
echo "📦 Création de la base de données..."
php bin/console doctrine:database:create --if-not-exists --no-interaction

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

# 🚀 OPTIMISATION CRITIQUE : Démarrer PHP-FPM AVANT les fixtures
# Cela permet à Nginx de recevoir des connexions pendant que les fixtures se chargent
echo "🚀 Démarrage de PHP-FPM en mode daemon..."
php-fpm -D

echo "✅ PHP-FPM démarré ! L'API est maintenant accessible."

# Charger les fixtures en environnement de test
if [ "$APP_ENV" = "test" ]; then
    echo "🌱 Chargement des fixtures : $FIXTURES_SUITE..."

    # Charger les fixtures et vérifier le résultat
    if php bin/console sylius:fixtures:load "$FIXTURES_SUITE" --no-interaction -v 2>&1 | tee /tmp/fixtures.log; then
        echo "✅ Fixtures chargées avec succès !"
    else
        echo "❌ ERREUR: Échec du chargement des fixtures"
        echo "📋 Dernières lignes du log:"
        tail -50 /tmp/fixtures.log
        exit 1
    fi
fi

# Vider le cache
echo "🧹 Nettoyage du cache..."
php bin/console cache:clear --no-warmup
php bin/console cache:warmup

echo "✅ Sylius E2E est complètement prêt !"
echo "📊 Statistiques :"
echo "  - Environnement : $ENV_TYPE"
echo "  - Fixtures : $FIXTURES_SUITE"
echo "  - PHP-FPM : ✅ Running"
echo "  - Database : ✅ Ready"
echo "  - Cache : ✅ Warmed"

# Garder le container actif (car PHP-FPM est en mode daemon)
tail -f /dev/null