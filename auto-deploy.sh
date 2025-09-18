#!/bin/bash

# Auto Deploy Setup Script - GitHub Webhook Integration
# Usage: ./auto-deploy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Welcome message
clear
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${GREEN}🚀 AUTO-DEPLOY SETUP WIZARD${PURPLE}                                        ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${CYAN}Automated GitHub Push Deployment System${PURPLE}                           ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${YELLOW}✨ Features:${PURPLE}                                                      ║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Automatic git pull on GitHub push                            ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Auto dependency installation (yarn/npm)                      ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Application rebuild and restart                              ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Webhook endpoint with security                               ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Deployment logs and notifications                            ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${YELLOW}🔧 Deployment Methods:${PURPLE}                                             ║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} PM2 Process Management                                        ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} Docker Container Deployment                                   ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} Nginx Configuration Update                                    ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} Database Migration Support                                    ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🎯 ${BLUE}This wizard will setup automatic deployment when you push to GitHub.${NC}"
echo -e "${BLUE}   Your application will automatically update, install dependencies, and restart.${NC}"
echo ""

# Interactive configuration
echo -e "${GREEN}📋 Auto-Deploy Configuration${NC}"
echo ""

# App Name
echo -e "${CYAN}Enter application name ${YELLOW}[earnfromadsbd]${NC}: "
read APP_NAME
APP_NAME=${APP_NAME:-earnfromadsbd}

# Git Repository
echo -e "${CYAN}Enter GitHub repository URL: ${NC}"
read GIT_REPO
while [ -z "$GIT_REPO" ]; do
    echo -e "${RED}❌ Git repository URL is required${NC}"
    echo -e "${CYAN}Enter GitHub repository URL: ${NC}"
    read GIT_REPO
done

# Branch
echo -e "${CYAN}Enter branch to deploy ${YELLOW}[main]${NC}: "
read BRANCH
BRANCH=${BRANCH:-main}

# App Directory
echo -e "${CYAN}Enter application directory ${YELLOW}[/var/www/$APP_NAME]${NC}: "
read APP_DIR
APP_DIR=${APP_DIR:-/var/www/$APP_NAME}

# Webhook Port
echo -e "${CYAN}Enter webhook port ${YELLOW}[9000]${NC}: "
read WEBHOOK_PORT
WEBHOOK_PORT=${WEBHOOK_PORT:-9000}

# Webhook Secret
echo -e "${CYAN}Enter webhook secret (leave empty for auto-generated): ${NC}"
read -s WEBHOOK_SECRET
echo
if [ -z "$WEBHOOK_SECRET" ]; then
    WEBHOOK_SECRET=$(openssl rand -hex 32)
    echo -e "${YELLOW}Generated webhook secret: $WEBHOOK_SECRET${NC}"
fi

# Deployment Type
echo -e "${CYAN}Select deployment type:${NC}"
echo -e "${YELLOW}1.${NC} PM2 (Process Manager)"
echo -e "${YELLOW}2.${NC} Docker (Container)"
echo -e "${YELLOW}3.${NC} Both PM2 and Docker"
echo -e "${CYAN}Enter choice ${YELLOW}[1]${NC}: "
read DEPLOY_TYPE
DEPLOY_TYPE=${DEPLOY_TYPE:-1}

# Package Manager
echo -e "${CYAN}Select package manager:${NC}"
echo -e "${YELLOW}1.${NC} Yarn"
echo -e "${YELLOW}2.${NC} NPM"
echo -e "${CYAN}Enter choice ${YELLOW}[1]${NC}: "
read PKG_MANAGER
PKG_MANAGER=${PKG_MANAGER:-1}

if [ "$PKG_MANAGER" = "1" ]; then
    PKG_CMD="yarn"
    INSTALL_CMD="yarn install"
    BUILD_CMD="yarn build"
else
    PKG_CMD="npm"
    INSTALL_CMD="npm install"
    BUILD_CMD="npm run build"
fi

# Notification Settings
echo -e "${CYAN}Do you want deployment notifications? (y/n) ${YELLOW}[y]${NC}: "
read NOTIFICATIONS
NOTIFICATIONS=${NOTIFICATIONS:-y}

if [[ $NOTIFICATIONS =~ ^[Yy]$ ]]; then
    echo -e "${CYAN}Enter notification email (optional): ${NC}"
    read NOTIFICATION_EMAIL
fi

# Display configuration summary
echo ""
echo -e "${GREEN}📋 Configuration Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}App Name:${NC} $APP_NAME"
echo -e "${YELLOW}Repository:${NC} $GIT_REPO"
echo -e "${YELLOW}Branch:${NC} $BRANCH"
echo -e "${YELLOW}Directory:${NC} $APP_DIR"
echo -e "${YELLOW}Webhook Port:${NC} $WEBHOOK_PORT"
echo -e "${YELLOW}Package Manager:${NC} $PKG_CMD"
echo -e "${YELLOW}Deploy Type:${NC} $(case $DEPLOY_TYPE in 1) echo "PM2";; 2) echo "Docker";; 3) echo "PM2 + Docker";; esac)"
echo -e "${YELLOW}Notifications:${NC} $(if [[ $NOTIFICATIONS =~ ^[Yy]$ ]]; then echo "Enabled"; else echo "Disabled"; fi)"
if [ -n "$NOTIFICATION_EMAIL" ]; then
    echo -e "${YELLOW}Email:${NC} $NOTIFICATION_EMAIL"
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
echo -e "${BLUE}🚀 Starting auto-deploy setup${NC}"

# Install required packages
echo -e "${BLUE}📦 Installing required packages...${NC}"
sudo apt update
sudo apt install -y nodejs npm python3 python3-pip nginx

# Install webhook listener
echo -e "${BLUE}📦 Installing webhook listener...${NC}"
sudo npm install -g webhook

# Create webhook directory
echo -e "${BLUE}📁 Creating webhook directory...${NC}"
sudo mkdir -p /var/webhooks
sudo chown -R $USER:$USER /var/webhooks

# Create deployment script
echo -e "${BLUE}📝 Creating deployment script...${NC}"
cat > /var/webhooks/deploy-${APP_NAME}.sh << EOF
#!/bin/bash

# Auto-deployment script for $APP_NAME
# Generated by auto-deploy setup wizard

set -e

# Configuration
APP_NAME="$APP_NAME"
APP_DIR="$APP_DIR"
GIT_REPO="$GIT_REPO"
BRANCH="$BRANCH"
PKG_CMD="$PKG_CMD"
INSTALL_CMD="$INSTALL_CMD"
BUILD_CMD="$BUILD_CMD"
DEPLOY_TYPE="$DEPLOY_TYPE"
NOTIFICATION_EMAIL="$NOTIFICATION_EMAIL"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Log file
LOG_FILE="/var/log/deploy-\${APP_NAME}.log"
DATE=\$(date '+%Y-%m-%d %H:%M:%S')

# Function to log messages
log_message() {
    echo "[\$DATE] \$1" | tee -a \$LOG_FILE
}

# Function to send notification
send_notification() {
    local status="\$1"
    local message="\$2"
    
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "\$message" | mail -s "[\$APP_NAME] Deployment \$status" $NOTIFICATION_EMAIL 2>/dev/null || true
    fi
}

# Start deployment
log_message "🚀 Starting deployment for \$APP_NAME"
send_notification "STARTED" "Deployment started for \$APP_NAME at \$DATE"

cd \$APP_DIR

# Git pull
log_message "📥 Pulling latest changes from \$BRANCH branch"
if git pull origin \$BRANCH; then
    log_message "✅ Git pull successful"
else
    log_message "❌ Git pull failed"
    send_notification "FAILED" "Git pull failed for \$APP_NAME at \$DATE"
    exit 1
fi

# Install dependencies
log_message "📦 Installing dependencies with \$PKG_CMD"
if \$INSTALL_CMD; then
    log_message "✅ Dependencies installed successfully"
else
    log_message "❌ Dependency installation failed"
    send_notification "FAILED" "Dependency installation failed for \$APP_NAME at \$DATE"
    exit 1
fi

# Build application
log_message "🔨 Building application"
if \$BUILD_CMD; then
    log_message "✅ Build successful"
else
    log_message "❌ Build failed"
    send_notification "FAILED" "Build failed for \$APP_NAME at \$DATE"
    exit 1
fi

# Deploy based on type
case \$DEPLOY_TYPE in
    1|3) # PM2 deployment
        log_message "🔄 Restarting PM2 application"
        if pm2 restart \$APP_NAME 2>/dev/null || pm2 start ecosystem.config.js; then
            log_message "✅ PM2 restart successful"
        else
            log_message "❌ PM2 restart failed"
            send_notification "FAILED" "PM2 restart failed for \$APP_NAME at \$DATE"
            exit 1
        fi
        ;;
esac

case \$DEPLOY_TYPE in
    2|3) # Docker deployment
        log_message "🐳 Rebuilding Docker containers"
        if docker-compose down && docker-compose up -d --build; then
            log_message "✅ Docker deployment successful"
        else
            log_message "❌ Docker deployment failed"
            send_notification "FAILED" "Docker deployment failed for \$APP_NAME at \$DATE"
            exit 1
        fi
        ;;
esac

# Reload Nginx (if needed)
log_message "🌐 Reloading Nginx configuration"
sudo systemctl reload nginx 2>/dev/null || true

# Success
log_message "🎉 Deployment completed successfully"
send_notification "SUCCESS" "Deployment completed successfully for \$APP_NAME at \$DATE"

echo "✅ Deployment completed successfully!"
EOF

chmod +x /var/webhooks/deploy-${APP_NAME}.sh

# Create webhook configuration
echo -e "${BLUE}⚙️ Creating webhook configuration...${NC}"
cat > /var/webhooks/hooks.json << EOF
[
  {
    "id": "${APP_NAME}-deploy",
    "execute-command": "/var/webhooks/deploy-${APP_NAME}.sh",
    "command-working-directory": "$APP_DIR",
    "response-message": "Deployment triggered for $APP_NAME",
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hmac-sha256",
            "secret": "$WEBHOOK_SECRET",
            "parameter": {
              "source": "header",
              "name": "X-Hub-Signature-256"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "value": "refs/heads/$BRANCH",
            "parameter": {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
EOF

# Create systemd service for webhook
echo -e "${BLUE}🔧 Creating webhook systemd service...${NC}"
sudo tee /etc/systemd/system/webhook-${APP_NAME}.service << EOF
[Unit]
Description=Webhook service for $APP_NAME
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/webhooks
ExecStart=/usr/local/bin/webhook -hooks hooks.json -port $WEBHOOK_PORT -verbose
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Enable and start webhook service
echo -e "${BLUE}🚀 Starting webhook service...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable webhook-${APP_NAME}
sudo systemctl start webhook-${APP_NAME}

# Configure Nginx for webhook
echo -e "${BLUE}🌐 Configuring Nginx for webhook...${NC}"
sudo tee /etc/nginx/sites-available/webhook-${APP_NAME} << EOF
server {
    listen 80;
    server_name webhook-${APP_NAME}.$(hostname -f);

    location /webhook {
        proxy_pass http://localhost:$WEBHOOK_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/webhook-${APP_NAME} /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Create management scripts
echo -e "${BLUE}📝 Creating management scripts...${NC}"

# Status script
cat > check-webhook.sh << EOF
#!/bin/bash
echo "=== Webhook Service Status ==="
sudo systemctl status webhook-${APP_NAME}
echo ""
echo "=== Recent Deployment Logs ==="
tail -20 /var/log/deploy-${APP_NAME}.log 2>/dev/null || echo "No deployment logs yet"
EOF
chmod +x check-webhook.sh

# Manual deploy script
cat > manual-deploy.sh << EOF
#!/bin/bash
echo "🚀 Triggering manual deployment..."
/var/webhooks/deploy-${APP_NAME}.sh
EOF
chmod +x manual-deploy.sh

# Webhook test script
cat > test-webhook.sh << EOF
#!/bin/bash
echo "🧪 Testing webhook endpoint..."
curl -X POST http://localhost:$WEBHOOK_PORT/hooks/${APP_NAME}-deploy \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=\$(echo -n '{}' | openssl dgst -sha256 -hmac '$WEBHOOK_SECRET' | cut -d' ' -f2)" \
  -d '{"ref":"refs/heads/$BRANCH"}'
EOF
chmod +x test-webhook.sh

# Create log rotation
echo -e "${BLUE}📋 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/deploy-${APP_NAME} << EOF
/var/log/deploy-${APP_NAME}.log {
    daily
    missingok
    rotate 30
    compress
    notifempty
    create 644 $USER $USER
}
EOF

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}🎉 ${YELLOW}AUTO-DEPLOY SETUP COMPLETED SUCCESSFULLY!${NC}"
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${GREEN}✅ WEBHOOK DEPLOYMENT SYSTEM${PURPLE} - ${CYAN}Ready for GitHub Integration${PURPLE}     ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"

echo -e "${BLUE}📋 Webhook Configuration:${NC}"
echo -e "  • Webhook URL: ${YELLOW}http://$(hostname -f)/webhook${NC}"
echo -e "  • Webhook Port: ${YELLOW}$WEBHOOK_PORT${NC}"
echo -e "  • Webhook Secret: ${YELLOW}$WEBHOOK_SECRET${NC}"
echo -e "  • Branch: ${YELLOW}$BRANCH${NC}"
echo -e "  • Deploy Type: ${YELLOW}$(case $DEPLOY_TYPE in 1) echo "PM2";; 2) echo "Docker";; 3) echo "PM2 + Docker";; esac)${NC}"
echo ""
echo -e "${BLUE}📁 Files Created:${NC}"
echo -e "  • Deploy Script: ${YELLOW}/var/webhooks/deploy-${APP_NAME}.sh${NC}"
echo -e "  • Webhook Config: ${YELLOW}/var/webhooks/hooks.json${NC}"
echo -e "  • Service File: ${YELLOW}/etc/systemd/system/webhook-${APP_NAME}.service${NC}"
echo -e "  • Nginx Config: ${YELLOW}/etc/nginx/sites-available/webhook-${APP_NAME}${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "  • Check status: ${CYAN}./check-webhook.sh${NC}"
echo -e "  • Manual deploy: ${CYAN}./manual-deploy.sh${NC}"
echo -e "  • Test webhook: ${CYAN}./test-webhook.sh${NC}"
echo -e "  • View logs: ${CYAN}tail -f /var/log/deploy-${APP_NAME}.log${NC}"
echo -e "  • Restart service: ${CYAN}sudo systemctl restart webhook-${APP_NAME}${NC}"
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${BLUE}📝 GITHUB WEBHOOK SETUP INSTRUCTIONS${PURPLE}                               ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${CYAN}1.${NC} Go to your GitHub repository settings                           ${PURPLE}║${NC}"
echo -e "${PURPLE}║    ${CYAN}2.${NC} Click on 'Webhooks' in the left sidebar                        ${PURPLE}║${NC}"
echo -e "${PURPLE}║    ${CYAN}3.${NC} Click 'Add webhook'                                             ${PURPLE}║${NC}"
echo -e "${PURPLE}║    ${CYAN}4.${NC} Set Payload URL: ${YELLOW}http://$(hostname -f)/webhook${PURPLE}                    ║${NC}"
echo -e "${PURPLE}║    ${CYAN}5.${NC} Set Content type: application/json                             ${PURPLE}║${NC}"
echo -e "${PURPLE}║    ${CYAN}6.${NC} Set Secret: ${YELLOW}$WEBHOOK_SECRET${PURPLE}                                      ║${NC}"
echo -e "${PURPLE}║    ${CYAN}7.${NC} Select 'Just the push event'                                   ${PURPLE}║${NC}"
echo -e "${PURPLE}║    ${CYAN}8.${NC} Click 'Add webhook'                                             ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                    🎯 AUTO-DEPLOY READY! 🎯${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
