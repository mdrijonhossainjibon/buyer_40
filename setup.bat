@echo off
setlocal enabledelayedexpansion

:: Colors for Windows (limited support)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "PURPLE=[95m"
set "CYAN=[96m"
set "NC=[0m"

:: Welcome message
cls
echo %PURPLE%╔══════════════════════════════════════════════════════════════╗%NC%
echo %PURPLE%║                    VPS Setup Wizard                         ║%NC%
echo %PURPLE%║              Next.js App Deployment Tool                    ║%NC%
echo %PURPLE%║                                                              ║%NC%
echo %PURPLE%║           Developer: Md Rijon Hossain Jibon YT              ║%NC%
echo %PURPLE%╚══════════════════════════════════════════════════════════════╝%NC%
echo.
echo %BLUE%This script will help you deploy your Next.js application on a VPS%NC%
echo %BLUE%with Nginx, PM2, and all necessary configurations.%NC%
echo.
echo %YELLOW%Note: This script generates configuration files for Linux deployment.%NC%
echo %YELLOW%Upload the generated files to your Linux VPS and run the setup there.%NC%
echo.

:: Interactive configuration
echo %GREEN%📋 Configuration Setup%NC%
echo.

:: App Name
:ask_app_name
set /p "APP_NAME=Enter application name [earnfromadsbd]: "
if "%APP_NAME%"=="" set "APP_NAME=earnfromadsbd"
echo %APP_NAME% | findstr /r "^[a-zA-Z0-9_-][a-zA-Z0-9_-]*$" >nul
if errorlevel 1 (
    echo %RED%❌ Invalid app name. Use only letters, numbers, hyphens, and underscores%NC%
    goto ask_app_name
)
if not "%APP_NAME:~30,1%"=="" (
    echo %RED%❌ App name too long. Maximum 30 characters%NC%
    goto ask_app_name
)

:: Domain Name
:ask_domain
set /p "DOMAIN=Enter your domain name [example.com]: "
if "%DOMAIN%"=="" set "DOMAIN=example.com"

:: Node.js Version
set /p "NODE_VERSION=Enter Node.js version [18]: "
if "%NODE_VERSION%"=="" set "NODE_VERSION=18"

:: Port
:ask_port
set /p "PORT=Enter application port [3000]: "
if "%PORT%"=="" set "PORT=3000"
echo %PORT% | findstr /r "^[0-9][0-9]*$" >nul
if errorlevel 1 (
    echo %RED%❌ Invalid port. Please enter a number%NC%
    goto ask_port
)
if %PORT% lss 1000 (
    echo %RED%❌ Port must be 1000 or higher%NC%
    goto ask_port
)
if %PORT% gtr 65535 (
    echo %RED%❌ Port must be 65535 or lower%NC%
    goto ask_port
)

:: Environment
set /p "ENV=Enter environment [production]: "
if "%ENV%"=="" set "ENV=production"

:: Git Repository
set /p "GIT_REPO=Enter Git repository URL (optional): "

:: SSL Setup
:ask_ssl
set /p "SSL_SETUP=Do you want to setup SSL certificate? (y/n) [n]: "
if "%SSL_SETUP%"=="" set "SSL_SETUP=n"
if /i "%SSL_SETUP%"=="y" goto ssl_email
if /i "%SSL_SETUP%"=="n" goto pm2_instances
echo %RED%❌ Please enter 'y' or 'n'%NC%
goto ask_ssl

:ssl_email
set /p "EMAIL=Enter email for SSL certificate [admin@%DOMAIN%]: "
if "%EMAIL%"=="" set "EMAIL=admin@%DOMAIN%"

:pm2_instances
set /p "INSTANCES=Enter number of PM2 instances [max]: "
if "%INSTANCES%"=="" set "INSTANCES=max"

:: Configuration Summary
echo.
echo %GREEN%📋 Configuration Summary%NC%
echo %BLUE%═══════════════════════════════════════%NC%
echo %YELLOW%App Name:%NC% %APP_NAME%
echo %YELLOW%Domain:%NC% %DOMAIN%
echo %YELLOW%Directory:%NC% /var/www/%APP_NAME%
echo %YELLOW%Node.js Version:%NC% %NODE_VERSION%
echo %YELLOW%Port:%NC% %PORT%
echo %YELLOW%Environment:%NC% %ENV%
echo %YELLOW%PM2 Instances:%NC% %INSTANCES%
if not "%GIT_REPO%"=="" echo %YELLOW%Git Repository:%NC% %GIT_REPO%
if /i "%SSL_SETUP%"=="y" (
    echo %YELLOW%SSL:%NC% Enabled ^(%EMAIL%^)
) else (
    echo %YELLOW%SSL:%NC% Disabled
)
echo %BLUE%═══════════════════════════════════════%NC%
echo.

:: Confirmation
:ask_confirm
set /p "CONFIRM=Do you want to proceed with this configuration? (y/n): "
if /i "%CONFIRM%"=="y" goto generate_files
if /i "%CONFIRM%"=="n" (
    echo %RED%❌ Setup cancelled by user%NC%
    pause
    exit /b 1
)
echo %RED%❌ Please enter 'y' or 'n'%NC%
goto ask_confirm

:generate_files
echo.
echo %BLUE%🚀 Generating deployment files...%NC%

:: Create deployment directory
if not exist "deployment" mkdir deployment

:: Generate Linux setup script
echo %BLUE%📝 Creating Linux setup script...%NC%
(
echo #!/bin/bash
echo.
echo # Auto-generated VPS setup script
echo # Generated on %DATE% %TIME%
echo.
echo set -e
echo.
echo # Colors
echo RED='\033[0;31m'
echo GREEN='\033[0;32m'
echo YELLOW='\033[1;33m'
echo BLUE='\033[0;34m'
echo NC='\033[0m'
echo.
echo # Configuration
echo APP_NAME="%APP_NAME%"
echo DOMAIN="%DOMAIN%"
echo NODE_VERSION="%NODE_VERSION%"
echo PORT=%PORT%
echo ENV="%ENV%"
if not "%GIT_REPO%"=="" echo GIT_REPO="%GIT_REPO%"
echo INSTANCES="%INSTANCES%"
echo APP_DIR="/var/www/$APP_NAME"
echo.
echo echo -e "${BLUE}🚀 Starting VPS setup for $APP_NAME${NC}"
echo.
echo # Update system
echo echo -e "${BLUE}📦 Updating system packages...${NC}"
echo sudo apt update ^&^& sudo apt upgrade -y
echo.
echo # Install Node.js
echo echo -e "${BLUE}📦 Installing Node.js $NODE_VERSION...${NC}"
echo curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x ^| sudo -E bash -
echo sudo apt-get install -y nodejs
echo.
echo # Install Yarn
echo echo -e "${BLUE}📦 Installing Yarn...${NC}"
echo curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg ^| sudo apt-key add -
echo echo "deb https://dl.yarnpkg.com/debian/ stable main" ^| sudo tee /etc/apt/sources.list.d/yarn.list
echo sudo apt update ^&^& sudo apt install -y yarn
echo.
echo # Install PM2
echo echo -e "${BLUE}📦 Installing PM2...${NC}"
echo sudo npm install -g pm2
echo.
echo # Install Nginx
echo echo -e "${BLUE}📦 Installing Nginx...${NC}"
echo sudo apt install -y nginx
echo.
if /i "%SSL_SETUP%"=="y" (
echo # Install Certbot
echo echo -e "${BLUE}📦 Installing Certbot...${NC}"
echo sudo apt install -y certbot python3-certbot-nginx
echo.
)
echo # Create app directory
echo echo -e "${BLUE}📁 Creating application directory...${NC}"
echo sudo mkdir -p $APP_DIR
echo sudo chown -R $USER:$USER $APP_DIR
echo.
if not "%GIT_REPO%"=="" (
echo # Clone repository
echo echo -e "${BLUE}📂 Cloning repository...${NC}"
echo git clone %GIT_REPO% $APP_DIR
) else (
echo # Copy files
echo echo -e "${BLUE}📂 Copy your application files to $APP_DIR${NC}"
echo echo -e "${YELLOW}⚠️  Please upload your Next.js app files to $APP_DIR${NC}"
)
echo.
echo cd $APP_DIR
echo.
echo # Install dependencies and build
echo echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo yarn install
echo echo -e "${BLUE}🔨 Building application...${NC}"
echo yarn build
echo.
echo # Setup PM2
echo echo -e "${BLUE}⚙️  Setting up PM2...${NC}"
echo pm2 start ecosystem.config.js
echo pm2 save
echo pm2 startup
echo.
echo # Configure firewall
echo echo -e "${BLUE}🔥 Configuring firewall...${NC}"
echo sudo ufw allow ssh
echo sudo ufw allow 'Nginx Full'
echo sudo ufw --force enable
echo.
if /i "%SSL_SETUP%"=="y" (
echo # Setup SSL
echo echo -e "${BLUE}🔒 Setting up SSL...${NC}"
echo sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email %EMAIL%
echo.
)
echo echo -e "${GREEN}✅ Setup completed!${NC}"
echo echo -e "${GREEN}🌐 Your app should be available at: http%SSL_PROTOCOL%://$DOMAIN${NC}"
) > deployment\linux-setup.sh

:: Generate PM2 ecosystem file
echo %BLUE%📝 Creating PM2 ecosystem file...%NC%
(
echo module.exports = {
echo   apps: [{
echo     name: '%APP_NAME%',
echo     script: 'yarn',
echo     args: 'start',
echo     cwd: '/var/www/%APP_NAME%',
echo     instances: '%INSTANCES%',
echo     exec_mode: 'cluster',
echo     env: {
echo       NODE_ENV: '%ENV%',
echo       PORT: %PORT%
echo     },
echo     error_file: '/var/log/pm2/%APP_NAME%-error.log',
echo     out_file: '/var/log/pm2/%APP_NAME%-out.log',
echo     log_file: '/var/log/pm2/%APP_NAME%.log',
echo     time: true
echo   }]
echo }
) > deployment\ecosystem.config.js

:: Generate Nginx config
echo %BLUE%📝 Creating Nginx configuration...%NC%
(
echo server {
echo     listen 80;
echo     server_name %DOMAIN% www.%DOMAIN%;
echo.
echo     # Security headers
echo     add_header X-Frame-Options "SAMEORIGIN" always;
echo     add_header X-XSS-Protection "1; mode=block" always;
echo     add_header X-Content-Type-Options "nosniff" always;
echo.
echo     # Gzip compression
echo     gzip on;
echo     gzip_vary on;
echo     gzip_min_length 1024;
echo     gzip_types text/plain text/css text/xml text/javascript application/javascript;
echo.
echo     # Static files
echo     location /_next/static {
echo         alias /var/www/%APP_NAME%/.next/static;
echo         expires 365d;
echo         access_log off;
echo     }
echo.
echo     location /static {
echo         alias /var/www/%APP_NAME%/public;
echo         expires 30d;
echo         access_log off;
echo     }
echo.
echo     # Proxy to Next.js
echo     location / {
echo         proxy_pass http://localhost:%PORT%;
echo         proxy_http_version 1.1;
echo         proxy_set_header Upgrade $http_upgrade;
echo         proxy_set_header Connection 'upgrade';
echo         proxy_set_header Host $host;
echo         proxy_set_header X-Real-IP $remote_addr;
echo         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo         proxy_set_header X-Forwarded-Proto $scheme;
echo         proxy_cache_bypass $http_upgrade;
echo     }
echo }
) > deployment\nginx-%APP_NAME%.conf

:: Generate update script
echo %BLUE%📝 Creating update script...%NC%
(
echo #!/bin/bash
echo cd /var/www/%APP_NAME%
if not "%GIT_REPO%"=="" echo git pull origin main
echo yarn install
echo yarn build
echo pm2 restart %APP_NAME%
echo echo "✅ Application updated successfully!"
) > deployment\update.sh

:: Generate README
echo %BLUE%📝 Creating deployment instructions...%NC%
(
echo # Deployment Instructions
echo.
echo ## Generated Configuration
echo - **App Name:** %APP_NAME%
echo - **Domain:** %DOMAIN%
echo - **Port:** %PORT%
echo - **Environment:** %ENV%
if /i "%SSL_SETUP%"=="y" echo - **SSL:** Enabled
echo.
echo ## Files Generated
echo - `linux-setup.sh` - Main setup script for Linux VPS
echo - `ecosystem.config.js` - PM2 configuration
echo - `nginx-%APP_NAME%.conf` - Nginx configuration
echo - `update.sh` - Update script
echo.
echo ## Deployment Steps
echo.
echo 1. **Upload files to your Linux VPS:**
echo    ```bash
echo    scp -r deployment/* user@your-server:/home/user/
echo    ```
echo.
echo 2. **Connect to your VPS and run setup:**
echo    ```bash
echo    ssh user@your-server
echo    chmod +x linux-setup.sh
echo    ./linux-setup.sh
echo    ```
echo.
echo 3. **Upload your Next.js app files to `/var/www/%APP_NAME%/`**
echo.
echo 4. **Configure Nginx:**
echo    ```bash
echo    sudo cp nginx-%APP_NAME%.conf /etc/nginx/sites-available/%APP_NAME%
echo    sudo ln -s /etc/nginx/sites-available/%APP_NAME% /etc/nginx/sites-enabled/
echo    sudo nginx -t
echo    sudo systemctl reload nginx
echo    ```
echo.
echo ## Useful Commands
echo - Update app: `/var/www/%APP_NAME%/update.sh`
echo - Restart app: `pm2 restart %APP_NAME%`
echo - View logs: `pm2 logs %APP_NAME%`
echo - Monitor: `pm2 monit`
echo.
echo ## Generated by VPS Setup Wizard
echo Developer: Md Rijon Hossain Jibon YT
) > deployment\README.md

echo.
echo %GREEN%✅ Deployment files generated successfully!%NC%
echo.
echo %PURPLE%╔══════════════════════════════════════════════════════════════╗%NC%
echo %PURPLE%║                    Files Generated                          ║%NC%
echo %PURPLE%╚══════════════════════════════════════════════════════════════╝%NC%
echo %BLUE%📁 Generated files in 'deployment' folder:%NC%
echo   • linux-setup.sh - Main setup script for Linux VPS
echo   • ecosystem.config.js - PM2 configuration
echo   • nginx-%APP_NAME%.conf - Nginx configuration  
echo   • update.sh - Update script
echo   • README.md - Deployment instructions
echo.
echo %YELLOW%📋 Next Steps:%NC%
echo   1. Upload 'deployment' folder to your Linux VPS
echo   2. Run: chmod +x linux-setup.sh ^&^& ./linux-setup.sh
echo   3. Upload your Next.js app files
echo   4. Follow instructions in README.md
echo.
echo %GREEN%🎉 Configuration completed!%NC%
pause

:todo_complete
