FROM ghcr.io/sylius/sylius-php:8.3-alpine

# Installer les packages système nécessaires et extensions PHP
RUN apk add --no-cache \
    git \
    unzip \
    postgresql-dev \
    && docker-php-ext-install pdo_pgsql

# Définir le timezone par défaut
ENV TZ=Europe/Paris
RUN echo "date.timezone = ${TZ}" > /usr/local/etc/php/conf.d/timezone.ini

# Définir le répertoire de travail (même chemin que Nginx)
WORKDIR /srv/sylius

# Copier les fichiers composer en premier (pour le cache Docker)
COPY composer.json composer.lock symfony.lock ./

# Installer les dépendances Composer
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --no-autoloader \
    --no-scripts \
    --ignore-platform-reqs

# Copier le reste du code source
COPY . .

# Finaliser l'installation Composer et générer l'autoloader
RUN composer dump-autoload --optimize --classmap-authoritative && \
    mkdir -p var/cache var/log var/sessions public/media config/jwt && \
    chmod -R 777 var public/media config/jwt

# Copier le script d'entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Exposition du port (si besoin pour healthcheck)
EXPOSE 9000

# Entrypoint pour initialiser Sylius
ENTRYPOINT ["docker-entrypoint.sh"]