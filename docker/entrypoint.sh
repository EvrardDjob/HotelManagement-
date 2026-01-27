#!/bin/bash

# Clear any cache that might have been created
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Run migrations
php artisan migrate --force

# Start supervisor
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf