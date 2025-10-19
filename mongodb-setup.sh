#!/bin/bash
set -e

CONTAINER_NAME="earnfromadsbd_mongodb"
MONGO_IMAGE="mongo:latest"   # always pull latest version
HOST_PORT=27018              # change to 27017 if no local MongoDB
DATA_VOLUME="mongodb_data"

MONGO_USER="admin"
MONGO_PASS="MdrijonHossainjibon"

echo "=== MongoDB Setup Script ==="

# Step 1: Remove old system MongoDB
if systemctl is-active --quiet mongod; then
  echo "Stopping system MongoDB service..."
  sudo systemctl stop mongod
fi

if dpkg -l | grep -q mongodb; then
  echo "Removing old MongoDB packages..."
  sudo apt purge -y mongodb* mongod* || true
  sudo apt autoremove -y
fi

# Step 2: Check Docker installation
if ! command -v docker &> /dev/null; then
  echo "Docker not found. Installing Docker..."
  sudo apt update
  sudo apt install -y docker.io
  sudo systemctl enable --now docker
fi

# Step 3: Pull latest MongoDB image
echo "Pulling latest MongoDB image..."
docker pull "${MONGO_IMAGE}"

# Step 4: Remove old MongoDB container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}\$"; then
  echo "Removing old MongoDB container '${CONTAINER_NAME}'..."
  docker rm -f "${CONTAINER_NAME}"
fi

# Step 5: Create new MongoDB container with authentication
echo "Creating new MongoDB container with user '${MONGO_USER}'..."
docker run -d \
  --name "${CONTAINER_NAME}" \
  -p ${HOST_PORT}:27017 \
  -v ${DATA_VOLUME}:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=${MONGO_USER} \
  -e MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASS} \
  --restart unless-stopped \
  "${MONGO_IMAGE}"

echo "✅ MongoDB setup complete!"
echo "🔑 Credentials:"
echo "   Username: ${MONGO_USER}"
echo "   Password: ${MONGO_PASS}"
echo "   Connection: mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:${HOST_PORT}/admin"
