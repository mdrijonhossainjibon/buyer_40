#!/bin/bash

# Database Setup Script with Docker and MongoDB
# Usage: ./database-setup.sh

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

# Function to validate app name
validate_app_name() {
    local name="$1"
    if [[ -n "$name" ]] && [ ${#name} -ge 1 ] && [ ${#name} -le 30 ] && [[ $name =~ ^[a-zA-Z0-9][a-zA-Z0-9_-]*$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to validate domain name
validate_domain() {
    local domain="$1"
    if [[ $domain =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]] || [[ $domain == "localhost" ]]; then
        return 0
    else
        return 1
    fi
}

# Welcome message
clear
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                 Docker Database Setup                       ║${NC}"
echo -e "${PURPLE}║            Next.js App with MongoDB Container               ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}║           Developer: Md Rijon Hossain Jibon YT               ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}This script will setup your Next.js application with MongoDB${NC}"
echo -e "${BLUE}using Docker containers for easy deployment and management.${NC}"
echo ""

# Interactive configuration
echo -e "${GREEN}📋 Configuration Setup${NC}"
echo ""

# App Name
echo -e "${CYAN}Enter application name ${YELLOW}[earnfromadsbd]${NC}: "
read APP_NAME
APP_NAME=${APP_NAME:-earnfromadsbd}

while ! validate_app_name "$APP_NAME"; do
    echo -e "${RED}❌ Invalid app name. Use only letters, numbers, hyphens, and underscores (1-30 chars)${NC}"
    echo -e "${CYAN}Enter application name: ${NC}"
    read APP_NAME
done

# Domain Name
echo -e "${CYAN}Enter your domain name ${YELLOW}[localhost]${NC}: "
read DOMAIN
DOMAIN=${DOMAIN:-localhost}

while ! validate_domain "$DOMAIN"; do
    echo -e "${RED}❌ Invalid domain format. Please enter a valid domain (e.g., example.com) or localhost${NC}"
    echo -e "${CYAN}Enter your domain name: ${NC}"
    read DOMAIN
done

# Application Port
echo -e "${CYAN}Enter application port ${YELLOW}[3000]${NC}: "
read APP_PORT
APP_PORT=${APP_PORT:-3000}

while ! [[ $APP_PORT =~ ^[0-9]+$ ]] || [ $APP_PORT -lt 1000 ] || [ $APP_PORT -gt 65535 ]; do
    echo -e "${RED}❌ Invalid port. Please enter a number between 1000-65535${NC}"
    echo -e "${CYAN}Enter application port: ${NC}"
    read APP_PORT
done

# MongoDB Configuration
echo -e "${CYAN}Enter MongoDB database name ${YELLOW}[$APP_NAME]${NC}: "
read DB_NAME
DB_NAME=${DB_NAME:-$APP_NAME}

echo -e "${CYAN}Enter MongoDB username ${YELLOW}[admin]${NC}: "
read DB_USER
DB_USER=${DB_USER:-admin}

echo -e "${CYAN}Enter MongoDB password (leave empty for auto-generated): ${NC}"
read -s DB_PASS
echo

if [ -z "$DB_PASS" ]; then
    DB_PASS=$(openssl rand -base64 32)
    echo -e "${YELLOW}Generated password: $DB_PASS${NC}"
fi

# MongoDB Port
echo -e "${CYAN}Enter MongoDB port ${YELLOW}[27017]${NC}: "
read MONGO_PORT
MONGO_PORT=${MONGO_PORT:-27017}

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
echo -e "${YELLOW}Domain:${NC} $DOMAIN"
echo -e "${YELLOW}Directory:${NC} $APP_DIR"
echo -e "${YELLOW}App Port:${NC} $APP_PORT"
echo -e "${YELLOW}Environment:${NC} $ENV"
echo -e "${YELLOW}MongoDB Database:${NC} $DB_NAME"
echo -e "${YELLOW}MongoDB User:${NC} $DB_USER"
echo -e "${YELLOW}MongoDB Port:${NC} $MONGO_PORT"
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
echo -e "${BLUE}🚀 Starting Docker-based setup for $APP_NAME${NC}"

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Docker
echo -e "${BLUE}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${BLUE}🐳 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

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

# Create Dockerfile
echo -e "${BLUE}🐳 Creating Dockerfile...${NC}"
cat > Dockerfile << EOF
# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE $APP_PORT

# Start the application
CMD ["yarn", "start"]
EOF

# Create docker-compose.yml
echo -e "${BLUE}🐳 Creating docker-compose.yml...${NC}"
cat > docker-compose.yml << EOF
version: '3.8'

services:
  app:
    build: .
    container_name: ${APP_NAME}_app
    ports:
      - "${APP_PORT}:${APP_PORT}"
    environment:
      - NODE_ENV=${ENV}
      - PORT=${APP_PORT}
      - MONGODB_URI=mongodb://${DB_USER}:${DB_PASS}@mongodb:27017/${DB_NAME}?authSource=admin
    depends_on:
      - mongodb
    restart: unless-stopped
    networks:
      - app-network

  mongodb:
    image: mongo:7.0
    container_name: ${APP_NAME}_mongodb
    ports:
      - "${MONGO_PORT}:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${DB_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${DB_PASS}
      - MONGO_INITDB_DATABASE=${DB_NAME}
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb_data:
EOF

# Create MongoDB initialization script
echo -e "${BLUE}🗄️ Creating MongoDB initialization script...${NC}"
cat > mongo-init.js << EOF
// MongoDB initialization script
db = db.getSiblingDB('${DB_NAME}');

// Create application user
db.createUser({
  user: '${DB_USER}',
  pwd: '${DB_PASS}',
  roles: [
    {
      role: 'readWrite',
      db: '${DB_NAME}'
    }
  ]
});

// Create initial collections if needed
db.createCollection('users');
db.createCollection('activities');
db.createCollection('ads');

print('Database ${DB_NAME} initialized successfully');
EOF

# Create .dockerignore
echo -e "${BLUE}🐳 Creating .dockerignore...${NC}"
cat > .dockerignore << EOF
node_modules
.next
.git
.gitignore
README.md
Dockerfile
docker-compose.yml
.dockerignore
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# Create environment file
echo -e "${BLUE}⚙️ Creating environment file...${NC}"
cat > .env.production << EOF
NODE_ENV=${ENV}
PORT=${APP_PORT}
MONGODB_URI=mongodb://${DB_USER}:${DB_PASS}@mongodb:27017/${DB_NAME}?authSource=admin
EOF

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
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Proxy all requests to Docker container
    location / {
        proxy_pass http://localhost:$APP_PORT;
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

    # Handle WebSocket connections
    location /ws {
        proxy_pass http://localhost:$APP_PORT;
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

# Start and enable Nginx
echo -e "${BLUE}🚀 Starting Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx

# Build and start Docker containers
echo -e "${BLUE}🐳 Building and starting Docker containers...${NC}"
docker-compose up -d --build

# Create management scripts
echo -e "${BLUE}📝 Creating management scripts...${NC}"

# Create start script
cat > start.sh << EOF
#!/bin/bash
cd $APP_DIR
docker-compose up -d
echo "✅ Application started successfully!"
echo "🌐 Available at: http://$DOMAIN"
EOF
chmod +x start.sh

# Create stop script
cat > stop.sh << EOF
#!/bin/bash
cd $APP_DIR
docker-compose down
echo "✅ Application stopped successfully!"
EOF
chmod +x stop.sh

# Create restart script
cat > restart.sh << EOF
#!/bin/bash
cd $APP_DIR
docker-compose restart
echo "✅ Application restarted successfully!"
EOF
chmod +x restart.sh

# Create update script
cat > update.sh << EOF
#!/bin/bash
cd $APP_DIR
if [ -n "$GIT_REPO" ]; then
    git pull origin main
fi
docker-compose down
docker-compose up -d --build
echo "✅ Application updated successfully!"
EOF
chmod +x update.sh

# Create backup script
cat > backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/$APP_NAME"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup MongoDB data
docker exec ${APP_NAME}_mongodb mongodump --username $DB_USER --password $DB_PASS --authenticationDatabase admin --db $DB_NAME --out /tmp/backup
docker cp ${APP_NAME}_mongodb:/tmp/backup \$BACKUP_DIR/mongodb_backup_\$DATE

# Backup application files
tar -czf \$BACKUP_DIR/app_backup_\$DATE.tar.gz -C /var/www $APP_NAME

# Clean old backups (keep last 7 days)
find \$BACKUP_DIR -name "*backup*" -mtime +7 -delete

echo "✅ Backup created: \$DATE"
EOF
chmod +x backup.sh

# Create logs script
cat > logs.sh << EOF
#!/bin/bash
cd $APP_DIR
echo "=== Application Logs ==="
docker-compose logs -f app
EOF
chmod +x logs.sh

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
docker-compose ps

echo ""
echo -e "${GREEN}✅ Docker-based setup completed successfully!${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    Deployment Summary                       ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  • Application: ${YELLOW}$APP_NAME${NC}"
echo -e "  • Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "  • App Port: ${YELLOW}$APP_PORT${NC}"
echo -e "  • Environment: ${YELLOW}$ENV${NC}"
echo -e "  • Directory: ${YELLOW}$APP_DIR${NC}"
echo -e "  • MongoDB Database: ${YELLOW}$DB_NAME${NC}"
echo -e "  • MongoDB Port: ${YELLOW}$MONGO_PORT${NC}"
echo -e "  • SSL: ${YELLOW}$(if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then echo "Enabled"; else echo "Disabled"; fi)${NC}"
echo ""
echo -e "${BLUE}📁 Files & Locations:${NC}"
echo -e "  • Nginx config: ${YELLOW}/etc/nginx/sites-available/$APP_NAME${NC}"
echo -e "  • Docker Compose: ${YELLOW}$APP_DIR/docker-compose.yml${NC}"
echo -e "  • Dockerfile: ${YELLOW}$APP_DIR/Dockerfile${NC}"
echo -e "  • Environment: ${YELLOW}$APP_DIR/.env.production${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "  • Start app: ${CYAN}$APP_DIR/start.sh${NC}"
echo -e "  • Stop app: ${CYAN}$APP_DIR/stop.sh${NC}"
echo -e "  • Restart app: ${CYAN}$APP_DIR/restart.sh${NC}"
echo -e "  • Update app: ${CYAN}$APP_DIR/update.sh${NC}"
echo -e "  • View logs: ${CYAN}$APP_DIR/logs.sh${NC}"
echo -e "  • Backup data: ${CYAN}$APP_DIR/backup.sh${NC}"
echo -e "  • Docker status: ${CYAN}docker-compose ps${NC}"
echo -e "  • MongoDB shell: ${CYAN}docker exec -it ${APP_NAME}_mongodb mongosh -u $DB_USER -p $DB_PASS --authenticationDatabase admin $DB_NAME${NC}"
if [[ $SSL_SETUP =~ ^[Yy]$ ]]; then
echo -e "  • SSL renewal: ${CYAN}sudo certbot renew${NC}"
fi
echo ""
echo -e "${GREEN}🌐 Your app is now available at: ${YELLOW}$PROTOCOL://$DOMAIN${NC}"
echo -e "${GREEN}🎉 Docker deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📝 Database Connection String:${NC}"
echo -e "${YELLOW}mongodb://$DB_USER:$DB_PASS@localhost:$MONGO_PORT/$DB_NAME?authSource=admin${NC}"
