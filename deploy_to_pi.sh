#!/bin/bash

# Deploy DasKasas Tag Tool to Raspberry Pi
# Usage: ./deploy_to_pi.sh [hostname or IP]

set -e

PI_HOST="${1:-rpi}"
DEPLOY_DIR="/home/leo/dk_tag_printer"

echo "===== Deploying DasKasas Tag Tool to Raspberry Pi ====="
echo "Target: $PI_HOST"
echo ""

# Test connection
echo "1. Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 "$PI_HOST" "echo 'Connected successfully'" >/dev/null 2>&1; then
    echo "❌ Cannot connect to $PI_HOST"
    echo ""
    echo "Please ensure:"
    echo "- The Raspberry Pi is powered on"
    echo "- It's connected to the network"
    echo "- SSH is enabled"
    echo "- Tailscale is running (or use local IP)"
    exit 1
fi
echo "✓ Connected to $PI_HOST"

# Check Docker installation
echo ""
echo "2. Checking Docker installation..."
if ssh "$PI_HOST" "docker --version && docker compose version" >/dev/null 2>&1; then
    echo "✓ Docker is installed"
else
    echo "⚠️  Docker not found. Installing Docker..."
    ssh "$PI_HOST" "curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker $USER && rm get-docker.sh"
    echo "✓ Docker installed. You may need to log out and back in."
fi

# Create deployment directory
echo ""
echo "3. Creating deployment directory..."
ssh "$PI_HOST" "mkdir -p $DEPLOY_DIR"
echo "✓ Directory created: $DEPLOY_DIR"

# Copy files to Pi
echo ""
echo "4. Copying application files..."
rsync -avz --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.git' \
    --exclude 'test_output.pdf' \
    ./ "$PI_HOST:$DEPLOY_DIR/"
echo "✓ Files copied"

# Stop existing containers
echo ""
echo "5. Stopping existing containers (if any)..."
ssh "$PI_HOST" "cd $DEPLOY_DIR && docker compose down 2>/dev/null || true"

# Build and start containers
echo ""
echo "6. Building and starting containers..."
ssh "$PI_HOST" "cd $DEPLOY_DIR && DOCKER_BUILDKIT=0 docker compose up --build -d"
echo "✓ Containers started"

# Check status
echo ""
echo "7. Checking container status..."
ssh "$PI_HOST" "cd $DEPLOY_DIR && docker compose ps"

echo ""
echo "===== Deployment Complete! ====="
echo ""
echo "The application is now running on your Raspberry Pi."
echo ""
echo "To access locally:"
echo "  Frontend: http://$PI_HOST:3000"
echo "  Backend:  http://$PI_HOST:8000"
echo ""
echo "Next steps:"
echo "1. Set up Cloudflare Tunnel (see cloudflare_setup.sh)"
echo "2. Configure your domain to point to the tunnel"
