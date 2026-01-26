# 1. Install system dependencies (including libraries for mbstring and gd)
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

# 2. Install PHP extensions (Removed the 'placeholder' error)
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd