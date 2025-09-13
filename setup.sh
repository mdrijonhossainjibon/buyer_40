#!/bin/bash

# VPS Setup Script for Next.js App with Interactive Configuration
# Usage: ./setup.sh

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
    if [[ $name =~ ^[a-zA-Z0-9_-]+$ ]] && [ ${#name} -ge 3 ] && [ ${#name} -le 30 ]; then
        return 0
    else
        return 1
    fi
}

# Welcome message
clear
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    VPS Setup Wizard                         ║${NC}"
echo -e "${PURPLE}║              Next.js App Deployment Tool                    ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}║           Developer: Md Rijon Hossain Jibon YT               ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}This script will help you deploy your Next.js application on a VPS${NC}"
echo -e "${BLUE}with Nginx, PM2, and all necessary configurations.${NC}"
echo ""

# Interactive configuration
echo -e "${GREEN}📋 Configuration Setup${NC}"
echo ""

# App Name
while true; do
    APP_NAME=$(read_input "Enter application name" "earnfromadsbd")
    if validate_app_name "$APP_NAME"; then
        break
    else
        echo -e "${RED}❌ Invalid app name. Use only letters, numbers, hyphens, and underscores (3-30 chars)${NC}"
    fi
done

# Domain Name
while true; do
    DOMAIN=$(read_input "Enter your domain name" "example.com")
    if [ "$DOMAIN" = "localhost" ] || validate_domain "$DOMAIN"; then
        break
    else
        echo -e "${RED}❌ Invalid domain format. Please enter a valid domain (e.g., example.com)${NC}"
    fi
done

# Node.js Version
NODE_VERSION=$(read_input "Enter Node.js version" "18")

# Port
while true; do
    PORT=$(read_input "Enter application port" "3000")
    if [[ $PORT =~ ^[0-9]+$ ]] && [ $PORT -ge 1000 ] && [ $PORT -le 65535 ]; then
        break
    else
        echo -e "${RED}❌ Invalid port. Please enter a number between 1000-65535${NC}"
    fi
done

# Environment
ENV=$(read_input "Enter environment" "production")

# Git Repository (optional)
GIT_REPO=$(read_input "Enter Git repository URL (optional)" "")

# SSL Setup
echo ""
echo -e "${CYAN}Do you want to setup SSL certificate? (y/n)${NC}"
read -r SSL_SETUP
SSL_SETUP=${SSL_SETUP:-n}

# Email for SSL (if SSL is enabled)
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
    EMAIL=$(read_input "Enter email for SSL certificate" "admin@$DOMAIN")
fi

# PM2 instances
INSTANCES=$(read_input "Enter number of PM2 instances (max for cluster mode)" "max")

# Configuration
APP_DIR="/var/www/$APP_NAME"

# Display configuration summary
echo ""
echo -e "${GREEN}📋 Configuration Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}App Name:${NC} $APP_NAME"
echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo -e "${YELLOW}Directory:${NC} $APP_DIR"
echo -e "${YELLOW}Node.js Version:${NC} $NODE_VERSION"
echo -e "${YELLOW}Port:${NC} $PORT"
echo -e "${YELLOW}Environment:${NC} $ENV"
echo -e "${YELLOW}PM2 Instances:${NC} $INSTANCES"
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
echo -e "${BLUE}🚀 Starting VPS setup for $APP_NAME${NC}"

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
echo -e "${BLUE}📦 Installing Node.js $NODE_VERSION...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
echo -e "${BLUE}📦 Installing Yarn...${NC}"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install -y yarn

# Install PM2 globally
echo -e "${BLUE}📦 Installing PM2...${NC}"
sudo npm install -g pm2

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
    echo -e "${YELLOW}⚠️  Please copy your application files to $APP_DIR${NC}"
fi

cd $APP_DIR

# Install dependencies
echo -e "${BLUE}📦 Installing application dependencies...${NC}"
yarn install

# Build the application
echo -e "${BLUE}🔨 Building Next.js application...${NC}"
yarn build

# Create PM2 ecosystem file
echo -e "${BLUE}⚙️  Creating PM2 configuration...${NC}"
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'yarn',
    args: 'start',
    cwd: '$APP_DIR',
    instances: '$INSTANCES',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: '$ENV',
      PORT: $PORT
    },
    error_file: '/var/log/pm2/$APP_NAME-error.log',
    out_file: '/var/log/pm2/$APP_NAME-out.log',
    log_file: '/var/log/pm2/$APP_NAME.log',
    time: true
  }]
}
EOF

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Create Nginx configuration
echo -e "${BLUE}🌐 Creating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

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
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Handle Next.js static files
    location /_next/static {
        alias $APP_DIR/.next/static;
        expires 365d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Handle public static files
    location /static {
        alias $APP_DIR/public;
        expires 30d;
        access_log off;
        add_header Cache-Control "public";
    }

    # Handle favicon and robots.txt
    location ~ ^/(favicon\.ico|robots\.txt) {
        root $APP_DIR/public;
        expires 30d;
        access_log off;
    }

    # Proxy all other requests to Next.js
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Handle WebSocket connections for Telegram Mini App
    location /ws {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
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
echo -e "${BLUE}🚀 Starting services...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx

# Start PM2 application
echo -e "${BLUE}🚀 Starting PM2 application...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup firewall
echo -e "${BLUE}🔥 Configuring firewall...${NC}"
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable


# Create update script
echo -e "${BLUE}📝 Creating update script...${NC}"
cat > $APP_DIR/update.sh << EOF
#!/bin/bash
cd $APP_DIR
if [ -n "$GIT_REPO" ]; then
    git pull origin main
fi
yarn install
yarn build
pm2 restart $APP_NAME
echo "✅ Application updated successfully!"
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
pm2 status

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    Deployment Summary                       ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  • Application: ${YELLOW}$APP_NAME${NC}"
echo -e "  • Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "  • Port: ${YELLOW}$PORT${NC}"
echo -e "  • Environment: ${YELLOW}$ENV${NC}"
echo -e "  • PM2 Instances: ${YELLOW}$INSTANCES${NC}"
echo -e "  • Directory: ${YELLOW}$APP_DIR${NC}"
echo -e "  • SSL: ${YELLOW}$(if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then echo "Enabled"; else echo "Disabled"; fi)${NC}"
echo ""
echo -e "${BLUE}📁 Files & Locations:${NC}"
echo -e "  • Nginx config: ${YELLOW}/etc/nginx/sites-available/$APP_NAME${NC}"
echo -e "  • PM2 logs: ${YELLOW}/var/log/pm2/${NC}"
echo -e "  • Update script: ${YELLOW}$APP_DIR/update.sh${NC}"
echo -e "  • Backup script: ${YELLOW}$APP_DIR/backup.sh${NC}"
echo ""
echo -e "${BLUE}🔧 Useful Commands:${NC}"
echo -e "  • Update app: ${CYAN}$APP_DIR/update.sh${NC}"
echo -e "  • Restart app: ${CYAN}pm2 restart $APP_NAME${NC}"
echo -e "  • View logs: ${CYAN}pm2 logs $APP_NAME${NC}"
echo -e "  • Monitor app: ${CYAN}pm2 monit${NC}"
echo -e "  • Nginx reload: ${CYAN}sudo systemctl reload nginx${NC}"
echo -e "  • Check status: ${CYAN}pm2 status${NC}"
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
echo -e "  • SSL renewal: ${CYAN}sudo certbot renew${NC}"
fi
echo ""
echo -e "${GREEN}🌐 Your app is now available at: ${YELLOW}$PROTOCOL://$DOMAIN${NC}"
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
