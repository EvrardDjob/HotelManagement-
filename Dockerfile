# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev \
    libjpeg-dev \
    libfreetype6-dev

# 2. Install PHP extensions
# Note: pdo_placeholder was removed and replaced with pdo
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd