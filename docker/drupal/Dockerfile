FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    unzip \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions required by Drupal 11
RUN docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        gd \
        opcache \
        intl \
        zip \
        bcmath \
        mbstring

# Configure OPcache for performance
RUN { \
    echo 'opcache.memory_consumption=256'; \
    echo 'opcache.interned_strings_buffer=16'; \
    echo 'opcache.max_accelerated_files=20000'; \
    echo 'opcache.revalidate_freq=2'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Configure PHP for Drupal
RUN { \
    echo 'memory_limit=512M'; \
    echo 'upload_max_filesize=64M'; \
    echo 'post_max_size=64M'; \
    echo 'max_execution_time=300'; \
    echo 'max_input_vars=5000'; \
    } > /usr/local/etc/php/conf.d/drupal-recommended.ini

# Install Composer 2.x
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy entrypoint
COPY docker/drupal/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
