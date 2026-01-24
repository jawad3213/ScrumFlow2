# Étape 1 : Build avec Composer (Multi-stage pour réduire la taille finale)
FROM composer:2.6 as build
WORKDIR /app
COPY . .
# On installe les dépendances ici pour ne pas encombrer l'image finale
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Étape 2 : Runtime léger et complet
FROM php:8.2-fpm-alpine

# Installation des dépendances système nécessaires (en une seule couche pour économiser)
RUN apk add --no-cache \
    libpq-dev \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    libzip-dev

# Installation des extensions PHP indispensables pour Laravel et PostgreSQL
RUN docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

WORKDIR /var/www

# On récupère uniquement le code et les dépendances déjà installées
COPY --from=build /app .

# Permissions pour Laravel (on ajoute bootstrap/cache qui manquait dans le nôtre)
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]