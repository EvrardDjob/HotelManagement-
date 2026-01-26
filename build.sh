#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install JS dependencies and build assets (Inertia/React)
npm install
npm run build

# Run migrations
php artisan migrate --force