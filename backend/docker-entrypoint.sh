#!/bin/sh
set -e

echo "🚀 Démarrage de Sylius..."
echo "📋 DATABASE_URL: ${DATABASE_URL}"

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

# Charger les fixtures en environnement de test
if [ "$APP_ENV" = "test" ]; then
    echo "🌱 Chargement des fixtures de test..."
    php bin/console sylius:fixtures:load --no-interaction || true
fi

# Vider le cache
echo "🧹 Nettoyage du cache..."
php bin/console cache:clear --no-warmup
php bin/console cache:warmup

echo "✅ Sylius est prêt !"

# Démarrer PHP-FPM
exec php-fpm