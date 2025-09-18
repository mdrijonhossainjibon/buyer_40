#!/bin/bash

# MongoDB Database Setup Script with Docker
# Usage: ./mongodb-setup.sh

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
echo -e "${PURPLE}║    ${GREEN}🚀 MONGODB DOCKER SETUP WIZARD${PURPLE}                                    ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${CYAN}Professional Database Deployment Solution${PURPLE}                        ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${YELLOW}✨ Features:${PURPLE}                                                      ║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Docker-based MongoDB deployment                               ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Automated user authentication setup                          ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Professional database initialization                         ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Complete backup & management scripts                         ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${GREEN}•${NC} Production-ready security configuration                      ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${YELLOW}🛠️  Management Tools:${PURPLE}                                             ║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} Start/Stop/Restart scripts                                    ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} MongoDB shell access                                          ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} Automated backup system                                       ${PURPLE}║${NC}"
echo -e "${PURPLE}║       ${CYAN}•${NC} Real-time log monitoring                                      ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${BLUE}👨‍💻 Developer: ${YELLOW}Md Rijon Hossain Jibon YT${PURPLE}                           ║${NC}"
echo -e "${PURPLE}║    ${BLUE}🌐 Project: ${YELLOW}EarnFromAds BD - Database Setup${PURPLE}                       ║${NC}"
echo -e "${PURPLE}║    ${BLUE}📅 Version: ${YELLOW}2.0 Professional Edition${PURPLE}                              ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🎯 ${BLUE}This professional setup wizard will configure a production-ready${NC}"
echo -e "${BLUE}   MongoDB database using Docker containers with enterprise-grade security.${NC}"
echo ""
echo -e "${YELLOW}⚡ Quick Setup Process:${NC}"
echo -e "${CYAN}   1.${NC} Configure database credentials"
echo -e "${CYAN}   2.${NC} Install Docker (if needed)"
echo -e "${CYAN}   3.${NC} Deploy MongoDB container"
echo -e "${CYAN}   4.${NC} Initialize database & collections"
echo -e "${CYAN}   5.${NC} Generate management scripts"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Interactive configuration
echo -e "${GREEN}📋 Database Configuration${NC}"
echo ""

# Database Name
echo -e "${CYAN}Enter database name ${YELLOW}[earnfromadsbd]${NC}: "
read DB_NAME
DB_NAME=${DB_NAME:-earnfromadsbd}

# MongoDB Username
echo -e "${CYAN}Enter MongoDB username ${YELLOW}[admin]${NC}: "
read DB_USER
DB_USER=${DB_USER:-admin}

# MongoDB Password
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

# Container Name
echo -e "${CYAN}Enter container name ${YELLOW}[${DB_NAME}_mongodb]${NC}: "
read CONTAINER_NAME
CONTAINER_NAME=${CONTAINER_NAME:-${DB_NAME}_mongodb}

# Display configuration summary
echo ""
echo -e "${GREEN}📋 Configuration Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}Database Name:${NC} $DB_NAME"
echo -e "${YELLOW}Username:${NC} $DB_USER"
echo -e "${YELLOW}Port:${NC} $MONGO_PORT"
echo -e "${YELLOW}Container Name:${NC} $CONTAINER_NAME"
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
echo -e "${BLUE}🚀 Starting MongoDB setup${NC}"

# Install Docker if not present
echo -e "${BLUE}🐳 Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Create MongoDB data directory
echo -e "${BLUE}📁 Creating MongoDB data directory...${NC}"
sudo mkdir -p /var/lib/mongodb-data
sudo chown -R $USER:$USER /var/lib/mongodb-data

# Create MongoDB initialization script
echo -e "${BLUE}🗄️ Creating MongoDB initialization script...${NC}"
cat > mongo-init.js << EOF
// MongoDB initialization script for ${DB_NAME}
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

// Create initial collections
db.createCollection('users');
db.createCollection('activities');
db.createCollection('ads');
db.createCollection('withdrawals');
db.createCollection('tasks');

print('Database ${DB_NAME} initialized successfully');
EOF

# Stop existing container if running
echo -e "${BLUE}🛑 Stopping existing MongoDB container (if any)...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Start MongoDB container
echo -e "${BLUE}🚀 Starting MongoDB container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  -p $MONGO_PORT:27017 \
  -v /var/lib/mongodb-data:/data/db \
  -v $(pwd)/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro \
  -e MONGO_INITDB_ROOT_USERNAME=$DB_USER \
  -e MONGO_INITDB_ROOT_PASSWORD=$DB_PASS \
  -e MONGO_INITDB_DATABASE=$DB_NAME \
  --restart unless-stopped \
  mongo:7.0

# Wait for MongoDB to start
echo -e "${BLUE}⏳ Waiting for MongoDB to start...${NC}"
sleep 10

# Test connection
echo -e "${BLUE}🧪 Testing MongoDB connection...${NC}"
if docker exec $CONTAINER_NAME mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is running and accessible${NC}"
else
    echo -e "${RED}❌ Failed to connect to MongoDB${NC}"
    exit 1
fi

# Create management scripts
echo -e "${BLUE}📝 Creating management scripts...${NC}"

# Create start script
cat > start-mongodb.sh << EOF
#!/bin/bash
docker start $CONTAINER_NAME
echo "✅ MongoDB started successfully!"
EOF
chmod +x start-mongodb.sh

# Create stop script
cat > stop-mongodb.sh << EOF
#!/bin/bash
docker stop $CONTAINER_NAME
echo "✅ MongoDB stopped successfully!"
EOF
chmod +x stop-mongodb.sh

# Create restart script
cat > restart-mongodb.sh << EOF
#!/bin/bash
docker restart $CONTAINER_NAME
echo "✅ MongoDB restarted successfully!"
EOF
chmod +x restart-mongodb.sh

# Create backup script
cat > backup-mongodb.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup MongoDB data
docker exec $CONTAINER_NAME mongodump --username $DB_USER --password $DB_PASS --authenticationDatabase admin --db $DB_NAME --out /tmp/backup
docker cp $CONTAINER_NAME:/tmp/backup \$BACKUP_DIR/mongodb_backup_\$DATE

# Clean old backups (keep last 7 days)
find \$BACKUP_DIR -name "mongodb_backup_*" -mtime +7 -exec rm -rf {} +

echo "✅ Backup created: mongodb_backup_\$DATE"
EOF
chmod +x backup-mongodb.sh

# Create logs script
cat > logs-mongodb.sh << EOF
#!/bin/bash
docker logs -f $CONTAINER_NAME
EOF
chmod +x logs-mongodb.sh

# Create shell access script
cat > mongodb-shell.sh << EOF
#!/bin/bash
docker exec -it $CONTAINER_NAME mongosh -u $DB_USER -p $DB_PASS --authenticationDatabase admin $DB_NAME
EOF
chmod +x mongodb-shell.sh

# Setup daily backup cron
echo "0 2 * * * $(pwd)/backup-mongodb.sh" | crontab -

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}🎉 ${YELLOW}MONGODB SETUP COMPLETED SUCCESSFULLY!${NC}"
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${GREEN}✅ DEPLOYMENT SUMMARY${PURPLE} - ${CYAN}Production Ready Database${PURPLE}                  ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${BLUE}📋 Database Configuration:${NC}"
echo -e "  • Database Name: ${YELLOW}$DB_NAME${NC}"
echo -e "  • Username: ${YELLOW}$DB_USER${NC}"
echo -e "  • Password: ${YELLOW}$DB_PASS${NC}"
echo -e "  • Port: ${YELLOW}$MONGO_PORT${NC}"
echo -e "  • Container: ${YELLOW}$CONTAINER_NAME${NC}"
echo ""
echo -e "${BLUE}📁 Files Created:${NC}"
echo -e "  • Initialization: ${YELLOW}$(pwd)/mongo-init.js${NC}"
echo -e "  • Data Directory: ${YELLOW}/var/lib/mongodb-data${NC}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "  • Start MongoDB: ${CYAN}./start-mongodb.sh${NC}"
echo -e "  • Stop MongoDB: ${CYAN}./stop-mongodb.sh${NC}"
echo -e "  • Restart MongoDB: ${CYAN}./restart-mongodb.sh${NC}"
echo -e "  • View logs: ${CYAN}./logs-mongodb.sh${NC}"
echo -e "  • MongoDB shell: ${CYAN}./mongodb-shell.sh${NC}"
echo -e "  • Backup database: ${CYAN}./backup-mongodb.sh${NC}"
echo -e "  • Container status: ${CYAN}docker ps | grep $CONTAINER_NAME${NC}"
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${BLUE}📝 DATABASE CONNECTION INFORMATION${PURPLE}                                  ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${CYAN}Connection String:${NC}"
echo -e "${YELLOW}mongodb://$DB_USER:$DB_PASS@localhost:$MONGO_PORT/$DB_NAME?authSource=admin${NC}"
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${GREEN}🚀 READY FOR PRODUCTION${PURPLE} - ${YELLOW}Your MongoDB is now live!${PURPLE}               ║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${CYAN}Next Steps:${PURPLE}                                                        ║${NC}"
echo -e "${PURPLE}║      ${GREEN}1.${NC} Use ./mongodb-shell.sh to access your database                ${PURPLE}║${NC}"
echo -e "${PURPLE}║      ${GREEN}2.${NC} Configure your application with the connection string        ${PURPLE}║${NC}"
echo -e "${PURPLE}║      ${GREEN}3.${NC} Run ./backup-mongodb.sh to test backup functionality        ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}║    ${BLUE}💡 Pro Tip:${NC} All management scripts are ready in your directory     ${PURPLE}║${NC}"
echo -e "${PURPLE}║                                                                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                    🎯 DEPLOYMENT SUCCESSFUL 🎯${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
