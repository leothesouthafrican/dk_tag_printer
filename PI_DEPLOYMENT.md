# Raspberry Pi Deployment Guide

## Current Status

**Raspberry Pi:** `rpi` (100.103.61.77)  
**Status:** Offline (last seen 40 days ago on Tailscale)  
**User:** leo

## Prerequisites

### 1. Get the Pi Online

**Option A: Via Tailscale (Recommended)**
```bash
# On the Raspberry Pi:
sudo systemctl start tailscaled
sudo systemctl enable tailscaled
tailscale up
```

**Option B: Via Local Network**
- Connect Pi to your local network (192.168.1.x)
- Find IP: `hostname -I` on the Pi
- Update SSH config to use local IP

### 2. Verify SSH Access
```bash
ssh rpi
# or
ssh leo@192.168.1.XXX
```

### 3. Install Prerequisites on Pi

**Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

**Cloudflared (for tunnel):**
```bash
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb
```

## Deployment Steps

### Step 1: Deploy Application

Run the automated deployment script:
```bash
./deploy_to_pi.sh
# or specify a different host
./deploy_to_pi.sh 192.168.1.XXX
```

This script will:
1. Test SSH connection
2. Check/install Docker
3. Create deployment directory
4. Copy all application files via rsync
5. Stop any existing containers
6. Build and start new containers
7. Show container status

**Manual deployment alternative:**
```bash
# From your Mac
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ rpi:/home/leo/dk_tag_printer/

# On the Pi
cd /home/leo/dk_tag_printer
DOCKER_BUILDKIT=0 docker compose up --build -d
```

### Step 2: Verify Deployment

Check containers are running:
```bash
ssh rpi "cd /home/leo/dk_tag_printer && docker compose ps"
```

Test locally on Pi network:
```bash
# Frontend
curl http://100.103.61.77:3000
# or
curl http://rpi:3000

# Backend
curl http://100.103.61.77:8000/health
```

### Step 3: Set Up Cloudflare Tunnel

Run the setup script:
```bash
./cloudflare_setup.sh
```

Then **on the Raspberry Pi**, follow the manual steps:

**1. Login to Cloudflare:**
```bash
cloudflared tunnel login
```
This will open a browser - authenticate with your Cloudflare account.

**2. Create the tunnel:**
```bash
cloudflared tunnel create daskasas-tag-tool
```
Copy the tunnel ID from the output (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

**3. Create config file:**
```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Add this content (replace TUNNEL_ID and domain):
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/leo/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  # Frontend
  - hostname: tags.yourdomain.com
    service: http://localhost:3000
  # Backend API  
  - hostname: tags-api.yourdomain.com
    service: http://localhost:8000
  # Catch-all
  - service: http_status:404
```

**4. Route DNS:**
```bash
cloudflared tunnel route dns daskasas-tag-tool tags.yourdomain.com
cloudflared tunnel route dns daskasas-tag-tool tags-api.yourdomain.com
```

**5. Start tunnel as a service:**
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
sudo systemctl status cloudflared
```

### Step 4: Update Backend for Cloudflare

On the Pi, update docker-compose.yml:
```bash
nano /home/leo/dk_tag_printer/docker-compose.yml
```

Add to backend service:
```yaml
backend:
  # ... existing config ...
  environment:
    - PYTHONUNBUFFERED=1
    - FORWARDED_ALLOW_IPS=*
```

Restart containers:
```bash
cd /home/leo/dk_tag_printer
docker compose down
docker compose up -d
```

## Verification

### Local Access
- Frontend: http://rpi:3000 (or http://100.103.61.77:3000)
- Backend: http://rpi:8000 (or http://100.103.61.77:8000)

### Public Access (via Cloudflare)
- Frontend: https://tags.yourdomain.com
- Backend API: https://tags-api.yourdomain.com

## Troubleshooting

### Pi Not Responding
```bash
# Check Tailscale status on your Mac
tailscale status | grep rpi

# Try local network
arp -a | grep -i "b8:27:eb\|dc:a6:32"
ping raspberrypi.local
```

### Docker Issues on Pi
```bash
# Check Docker status
ssh rpi "sudo systemctl status docker"

# Check logs
ssh rpi "cd /home/leo/dk_tag_printer && docker compose logs"

# Rebuild containers
ssh rpi "cd /home/leo/dk_tag_printer && docker compose up --build -d"
```

### Cloudflare Tunnel Issues
```bash
# Check tunnel status
ssh rpi "sudo systemctl status cloudflared"

# View logs
ssh rpi "sudo journalctl -u cloudflared -f"

# Test tunnel manually
ssh rpi "cloudflared tunnel run daskasas-tag-tool"
```

### Port Conflicts
```bash
# Check what's using ports
ssh rpi "sudo netstat -tulpn | grep -E ':3000|:8000'"
```

## Maintenance

### Update Application
```bash
# From your Mac
./deploy_to_pi.sh
```

### View Logs
```bash
ssh rpi "cd /home/leo/dk_tag_printer && docker compose logs -f"
```

### Restart Services
```bash
ssh rpi "cd /home/leo/dk_tag_printer && docker compose restart"
```

### Stop Services
```bash
ssh rpi "cd /home/leo/dk_tag_printer && docker compose down"
```

## Architecture on Pi

```
Raspberry Pi (100.103.61.77)
│
├── Tailscale (for secure remote access)
│
├── Docker Compose
│   ├── Backend (FastAPI) → Port 8000
│   └── Frontend (Next.js) → Port 3000
│
└── Cloudflared Tunnel
    ├── tags.yourdomain.com → :3000
    └── tags-api.yourdomain.com → :8000
```

## Notes

- The Pi is ARM64 architecture - Docker images will be built specifically for ARM
- Build times on Pi may be longer than on your Mac (especially Next.js)
- Consider using multi-stage builds to reduce image size
- Cloudflare Tunnel provides HTTPS automatically
- No need to open ports on your router
