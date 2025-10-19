#!/bin/bash

# Exit if any command fails
set -e

echo "=== Frontend Docker Setup ==="

# Ask user for domain
read -p "Enter your domain name (example.com): " DOMAIN

# Ask user for Git repository
read -p "Enter your Git repository URL (https://...): " GIT_REPO

# Variables
APP_NAME="frontend_app"
APP_DIR="$HOME/$DOMAIN-frontend"

echo "=== Installing dependencies (Docker, Docker Compose) ==="
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt install -y docker-compose
fi

echo "=== Cloning repository ==="
rm -rf $APP_DIR
git clone $GIT_REPO $APP_DIR
cd $APP_DIR

echo "=== Creating Dockerfile ==="
cat > Dockerfile <<'EOL'
# Stage 1: Build frontend
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOL

echo "=== Creating nginx.conf ==="
cat > nginx.conf <<'EOL'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }
}
EOL

echo "=== Creating docker-compose.yml ==="
cat > docker-compose.yml <<EOL
version: "3.8"
services:
  $APP_NAME:
    build: .
    container_name: $APP_NAME
    ports:
      - "80:80"
    restart: always
EOL

echo "=== Building and starting container ==="
docker-compose up -d --build

echo "✅ Deployment complete!"
echo "Visit: http://$DOMAIN"
