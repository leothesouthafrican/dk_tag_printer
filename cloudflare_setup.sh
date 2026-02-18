#!/bin/bash

# Set up Cloudflare Tunnel for DasKasas Tag Tool
# Usage: ./cloudflare_setup.sh [pi_hostname]

set -e

PI_HOST="${1:-rpi}"
TUNNEL_NAME="daskasas-tag-tool"

echo "===== Setting up Cloudflare Tunnel ====="
echo "Target: $PI_HOST"
echo ""

# Check if cloudflared is installed on Pi
echo "1. Checking cloudflared installation..."
if ssh "$PI_HOST" "which cloudflared" >/dev/null 2>&1; then
    echo "✓ cloudflared is already installed"
else
    echo "Installing cloudflared..."
    ssh "$PI_HOST" "curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb && sudo dpkg -i cloudflared.deb && rm cloudflared.deb"
    echo "✓ cloudflared installed"
fi

echo ""
echo "2. Creating tunnel configuration..."

# Create config file content
cat << 'EOF' > /tmp/cloudflared_config.yml
tunnel: TUNNEL_ID
credentials-file: /home/leo/.cloudflared/TUNNEL_ID.json

ingress:
  # Frontend
  - hostname: tags.yourdomain.com
    service: http://localhost:3000
  # Backend API
  - hostname: tags-api.yourdomain.com
    service: http://localhost:8000
  # Catch-all rule
  - service: http_status:404
EOF

echo "Configuration template created at /tmp/cloudflared_config.yml"
echo ""
echo "===== Manual Setup Steps ====="
echo ""
echo "3. On your Raspberry Pi, run:"
echo ""
echo "   # Login to Cloudflare"
echo "   cloudflared tunnel login"
echo ""
echo "   # Create tunnel"
echo "   cloudflared tunnel create $TUNNEL_NAME"
echo ""
echo "   # Copy the tunnel ID from the output, then edit the config:"
echo "   nano ~/.cloudflared/config.yml"
echo ""
echo "   # Copy the contents from /tmp/cloudflared_config.yml"
echo "   # Replace TUNNEL_ID with your actual tunnel ID"
echo "   # Replace yourdomain.com with your actual domain"
echo ""
echo "   # Route DNS"
echo "   cloudflared tunnel route dns $TUNNEL_NAME tags.yourdomain.com"
echo "   cloudflared tunnel route dns $TUNNEL_NAME tags-api.yourdomain.com"
echo ""
echo "   # Run the tunnel"
echo "   cloudflared tunnel run $TUNNEL_NAME"
echo ""
echo "   # Or install as a service"
echo "   sudo cloudflared service install"
echo "   sudo systemctl start cloudflared"
echo "   sudo systemctl enable cloudflared"
echo ""
echo "4. Update docker-compose.yml on Pi to allow Cloudflare IPs:"
echo ""
echo "   In backend service, add:"
echo "     environment:"
echo "       - FORWARDED_ALLOW_IPS=*"
echo ""
echo "For more info: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/"
