#!/bin/bash

# -----------------------------
# Interactive React Deployment Script
# -----------------------------

set -e

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🚀 React App Deployment Script${NC}"

# Ask for inputs
read -p "Enter your GitHub repository URL (e.g., https://github.com/user/repo.git): " REPO_URL
if [ -z "$REPO_URL" ]; then
    echo "❌ GitHub repo cannot be empty!"
    exit 1
fi

REPO_NAME=$(basename "$REPO_URL" .git)
read -p "Enter your app name (default: $REPO_NAME): " APP_NAME
APP_NAME=${APP_NAME:-$REPO_NAME}

read -p "Enter your domain (e.g., example.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Domain cannot be empty!"
    exit 1
fi

read -p "Enter the branch to deploy (default: main): " BRANCH
BRANCH=${BRANCH:-main}

APP_DIR="/var/www/$APP_NAME"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME.conf"

echo ""
echo -e "${GREEN}📋 Configuration:${NC}"
echo "Repository: $REPO_URL"
echo "App Name: $APP_NAME"
echo "Domain: $DOMAIN"
echo "Branch: $BRANCH"
echo "Deploy Directory: $APP_DIR"
echo ""

read -p "Proceed with deployment? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 0
fi

# -----------------------------
# Install dependencies if needed
# -----------------------------
echo -e "${GREEN}📦 Installing required packages...${NC}"

sudo apt update

# Git
if ! command -v git &> /dev/null; then
    echo "Installing Git..."
    sudo apt install git -y
else
    echo "Git already installed: $(git --version)"
fi

# Node.js (v18+)
if ! command -v node &> /dev/null || [ $(node -v | cut -d. -f1 | tr -d 'v') -lt 18 ]; then
    echo "Installing Node.js v18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt install nginx -y
else
    echo "Nginx already installed: $(nginx -v 2>&1)"
fi

# -----------------------------
# Clone or update repo
# -----------------------------
if [ -d "$APP_DIR" ]; then
    echo -e "${GREEN}📥 Repo exists. Pulling latest changes...${NC}"
    cd "$APP_DIR"
    git reset --hard
    git checkout $BRANCH
    git pull origin $BRANCH
else
    echo -e "${GREEN}📥 Cloning repository...${NC}"
    sudo git clone -b $BRANCH "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
fi

# -----------------------------
# Build React app
# -----------------------------
echo -e "${GREEN}🔨 Installing dependencies and building React app...${NC}"
npm install
npm run build

# -----------------------------
# Configure Nginx
# -----------------------------
echo -e "${GREEN}⚙ Configuring Nginx...${NC}"

sudo tee "$NGINX_CONF" > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN;

    root $APP_DIR/build;
    index index.html index.htm;

    location / {
        try_files \$uri /index.html;
    }
}
EOL

sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "Your React app is now live at: http://$DOMAIN"
echo "To update in the future: cd $APP_DIR && git pull && npm install && npm run build && sudo systemctl reload nginx"
