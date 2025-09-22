#!/bin/bash

# VPS Setup Script for React App with Static File Serving
# Usage: ./react_setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to read user input with default value
read_input() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        echo -ne "${CYAN}$prompt ${YELLOW}[$default]${NC}: "
    else
        echo -ne "${CYAN}$prompt${NC}: "
    fi
    
    read result
    echo "${result:-$default}"
}

# Function to validate domain name
validate_domain() {
    local domain="$1"
    if [[ $domain =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate app name
validate_app_name() {
    local name="$1"
    # Check if name is not empty, length is valid, and contains only valid characters
    if [[ -n "$name" ]] && [ ${#name} -ge 1 ] && [ ${#name} -le 30 ] && [[ $name =~ ^[a-zA-Z0-9][a-zA-Z0-9_-]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Welcome message
clear
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    VPS Setup Wizard                         ║${NC}"
echo -e "${PURPLE}║              React App Deployment Tool                      ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}║           Developer: Md Rijon Hossain Jibon YT               ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}This script will help you deploy your React application on a VPS${NC}"
echo -e "${BLUE}with Nginx serving static files directly (no PM2 needed).${NC}"
echo ""

# Interactive configuration
echo -e "${GREEN}📋 Configuration Setup${NC}"
echo ""

# App Name
echo -e "${CYAN}Enter application name ${YELLOW}[react-app]${NC}: "
read APP_NAME
APP_NAME=${APP_NAME:-react-app}

while ! validate_app_name "$APP_NAME"; do
    echo -e "${RED}❌ Invalid app name. Use only letters, numbers, hyphens, and underscores (1-30 chars)${NC}"
    echo -e "${CYAN}Enter application name: ${NC}"
    read APP_NAME
done

# Domain Name
echo -e "${CYAN}Enter your domain name ${YELLOW}[example.com]${NC}: "
read DOMAIN
DOMAIN=${DOMAIN:-example.com}

while [ "$DOMAIN" != "localhost" ] && ! validate_domain "$DOMAIN"; do
    echo -e "${RED}❌ Invalid domain format. Please enter a valid domain (e.g., example.com)${NC}"
    echo -e "${CYAN}Enter your domain name: ${NC}"
    read DOMAIN
done

# Node.js Version (for building only)
echo -e "${CYAN}Enter Node.js version for building ${YELLOW}[18]${NC}: "
read NODE_VERSION
NODE_VERSION=${NODE_VERSION:-18}

# Environment
echo -e "${CYAN}Enter environment ${YELLOW}[production]${NC}: "
read ENV
ENV=${ENV:-production}

# Git Repository (optional)
echo -e "${CYAN}Enter Git repository URL (optional): ${NC}"
read GIT_REPO

# SSL Setup
echo -e "${CYAN}Do you want to setup SSL certificate? (y/n) ${YELLOW}[n]${NC}: "
read SSL_SETUP
SSL_SETUP=${SSL_SETUP:-n}

# Email for SSL (if SSL is enabled)
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
    echo -e "${CYAN}Enter email for SSL certificate ${YELLOW}[admin@$DOMAIN]${NC}: "
    read EMAIL
    EMAIL=${EMAIL:-admin@$DOMAIN}
fi

# Configuration
APP_DIR="/var/www/$APP_NAME"

# Display configuration summary
echo ""
echo -e "${GREEN}📋 Configuration Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}App Name:${NC} $APP_NAME"
echo -e "${YELLOW}App Type:${NC} React (Static Files)"
echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo -e "${YELLOW}Directory:${NC} $APP_DIR"
echo -e "${YELLOW}Node.js Version:${NC} $NODE_VERSION (build only)"
echo -e "${YELLOW}Environment:${NC} $ENV"
if [ -n "$GIT_REPO" ]; then
    echo -e "${YELLOW}Git Repository:${NC} $GIT_REPO"
fi
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}SSL:${NC} Enabled (${EMAIL})"
else
    echo -e "${YELLOW}SSL:${NC} Disabled"
fi
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Confirmation
echo -e "${CYAN}Do you want to proceed with this configuration? (y/n)${NC}"
read -r CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Setup cancelled by user${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Starting VPS setup for React app: $APP_NAME${NC}"

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm (for building)
echo -e "${BLUE}📦 Installing Node.js $NODE_VERSION (for building)...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
echo -e "${BLUE}📦 Installing Yarn...${NC}"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y yarn

# Install Nginx
echo -e "${BLUE}📦 Installing Nginx...${NC}"
sudo apt install -y nginx

# Create application directory
echo -e "${BLUE}📁 Creating application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Setup application files
echo -e "${BLUE}📂 Setting up application files...${NC}"
if [ -n "$GIT_REPO" ]; then
    echo "Cloning from Git repository..."
    git clone $GIT_REPO $APP_DIR
elif [ -d "$(pwd)/src" ]; then
    echo "Copying files from current directory..."
    cp -r . $APP_DIR/
else
    echo -e "${YELLOW}⚠️  Please copy your React application files to $APP_DIR${NC}"
fi

cd $APP_DIR

# Install dependencies and build
echo -e "${BLUE}📦 Installing application dependencies...${NC}"
yarn install

echo -e "${BLUE}🔨 Building React application...${NC}"
yarn build

# Verify build directory exists
if [ ! -d "$APP_DIR/build" ]; then
    echo -e "${RED}❌ Build directory not found. Make sure your React app builds to 'build/' directory${NC}"
    exit 1
fi

echo -e "${GREEN}✅ React app built successfully! Static files ready in build/ directory${NC}"

# Create Nginx configuration for React static files
echo -e "${BLUE}🌐 Creating Nginx configuration for React static files...${NC}"
sudo tee /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Document root for React build files
    root $APP_DIR/build;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Handle static assets with long-term caching
    location /static/ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Handle favicon and other root files
    location ~ ^/(favicon\.ico|logo.*\.png|manifest\.json|robots\.txt) {
        expires 30d;
        access_log off;
        add_header Cache-Control "public";
    }

    # Handle all other requests - serve static files with fallback to index.html for SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache HTML files for a short time
        location ~* \.html$ {
            expires 5m;
            add_header Cache-Control "public, no-cache";
        }
        
        # Cache CSS and JS files
        location ~* \.(css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Cache images and fonts
        location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Enable the site
echo -e "${BLUE}🔗 Enabling Nginx site...${NC}"
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo -e "${BLUE}🧪 Testing Nginx configuration...${NC}"
sudo nginx -t

# Start and enable services
echo -e "${BLUE}🚀 Starting Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx

echo -e "${GREEN}🚀 React app is ready - served directly by Nginx as static files${NC}"

# Setup firewall
#echo -e "${BLUE}🔥 Configuring firewall...${NC}"
#sudo ufw allow ssh
#sudo ufw allow 'Nginx Full'
#sudo ufw --force enable

# Create update script for React
echo -e "${BLUE}📝 Creating update script...${NC}"
cat > $APP_DIR/update.sh << EOF
#!/bin/bash
cd $APP_DIR
if [ -n "$GIT_REPO" ]; then
    git pull origin main
fi
yarn install
yarn build
sudo systemctl reload nginx
echo "✅ React application updated successfully! Static files refreshed."
EOF

chmod +x $APP_DIR/update.sh

# Create backup script
echo -e "${BLUE}💾 Creating backup script...${NC}"
cat > $APP_DIR/backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/$APP_NAME"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR
tar -czf \$BACKUP_DIR/backup_\$DATE.tar.gz -C /var/www $APP_NAME
find \$BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
echo "✅ Backup created: backup_\$DATE.tar.gz"
EOF

chmod +x $APP_DIR/backup.sh

# Setup daily backup cron
echo "0 2 * * * $APP_DIR/backup.sh" | crontab -

# Add SSL setup if enabled
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔒 Installing Certbot and setting up SSL...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
    
    # Auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
    PROTOCOL="https"
else
    PROTOCOL="http"
fi

# Final status check
echo -e "${BLUE}🔍 Checking service status...${NC}"
sudo systemctl status nginx --no-pager -l
echo -e "${GREEN}✅ React app is served as static files - no PM2 process needed${NC}"

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    Deployment Summary                       ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  • Application: ${YELLOW}$APP_NAME${NC}"
echo -e "  • App Type: ${YELLOW}React (Static Files)${NC}"
echo -e "  • Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "  • Environment: ${YELLOW}$ENV${NC}"
echo -e "  • Directory: ${YELLOW}$APP_DIR${NC}"
echo -e "  • SSL: ${YELLOW}$(if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then echo "Enabled"; else echo "Disabled"; fi)${NC}"
echo ""
echo -e "${BLUE}📁 Files & Locations:${NC}"
echo -e "  • Nginx config: ${YELLOW}/etc/nginx/sites-available/$APP_NAME${NC}"
echo -e "  • Static files: ${YELLOW}$APP_DIR/build/${NC}"
echo -e "  • Nginx logs: ${YELLOW}/var/log/nginx/${NC}"
echo -e "  • Update script: ${YELLOW}$APP_DIR/update.sh${NC}"
echo -e "  • Backup script: ${YELLOW}$APP_DIR/backup.sh${NC}"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "  • Update app: ${CYAN}$APP_DIR/update.sh${NC}"
echo -e "  • Check build: ${CYAN}ls -la $APP_DIR/build/${NC}"
echo -e "  • View access logs: ${CYAN}sudo tail -f /var/log/nginx/access.log${NC}"
echo -e "  • View error logs: ${CYAN}sudo tail -f /var/log/nginx/error.log${NC}"
echo -e "  • Nginx reload: ${CYAN}sudo systemctl reload nginx${NC}"
echo -e "  • Nginx status: ${CYAN}sudo systemctl status nginx${NC}"
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
echo -e "  • SSL renewal: ${CYAN}sudo certbot renew${NC}"
fi
echo ""
echo -e "${GREEN}🌐 Your React app is now available at: ${YELLOW}$PROTOCOL://$DOMAIN${NC}"
echo -e "${GREEN}🎉 React deployment completed successfully!${NC}"
