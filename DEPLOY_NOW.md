# 🚀 Quick Deploy to Raspberry Pi

## ⚠️ Current Status
Your Raspberry Pi is **OFFLINE** (last seen 40 days ago on Tailscale at 100.103.61.77)

## 📋 Quick Start (Once Pi is Online)

### 1️⃣ Deploy Application (1 command)
```bash
./deploy_to_pi.sh
```

That's it! This will:
- ✓ Check connection
- ✓ Install Docker if needed
- ✓ Copy all files
- ✓ Build and start containers

### 2️⃣ Setup Cloudflare Tunnel (SSH to Pi)
```bash
ssh rpi
cloudflared tunnel login
cloudflared tunnel create daskasas-tag-tool
# Follow prompts, then:
nano ~/.cloudflared/config.yml
# Add config from cloudflare_setup.sh
cloudflared tunnel route dns daskasas-tag-tool tags.yourdomain.com
sudo cloudflared service install
```

## 🔧 Before You Start

### Get Pi Online First:

**Option 1: Tailscale (Recommended)**
```bash
# Connect to Pi directly (keyboard/monitor) or via local network
ssh leo@raspberrypi.local  # or find local IP

# On the Pi:
sudo systemctl start tailscaled
tailscale up
```

**Option 2: Local Network**
```bash
# Find Pi on local network:
ping raspberrypi.local
# or
arp -a | grep -i "b8:27:eb"

# SSH using local IP:
ssh leo@192.168.1.XXX
```

## 📱 Access URLs (After Deployment)

### Local (on your network):
- Frontend: http://rpi:3000
- Backend: http://rpi:8000
- API Docs: http://rpi:8000/docs

### Public (via Cloudflare):
- Frontend: https://tags.yourdomain.com
- Backend: https://tags-api.yourdomain.com

## 🆘 Quick Troubleshooting

### Can't reach Pi?
```bash
# Check Tailscale
tailscale status | grep rpi

# Try local network
ping raspberrypi.local
```

### Deployment failed?
```bash
# Check logs
ssh rpi "docker compose logs"

# Restart
ssh rpi "cd ~/dk_tag_printer && docker compose restart"
```

### Cloudflare tunnel not working?
```bash
# Check status
ssh rpi "sudo systemctl status cloudflared"

# View logs
ssh rpi "sudo journalctl -u cloudflared -f"
```

## 📚 Full Documentation

- **PI_DEPLOYMENT.md** - Complete deployment guide
- **QUICKSTART.md** - Local development
- **TEST_RESULTS.md** - Verification tests

## ✅ Verification Checklist

After deployment:
- [ ] SSH to Pi works
- [ ] Docker containers running: `docker compose ps`
- [ ] Frontend accessible: `curl http://localhost:3000`
- [ ] Backend healthy: `curl http://localhost:8000/health`
- [ ] Cloudflare tunnel created
- [ ] DNS routes configured
- [ ] Public URL accessible

---

**Next Command:** Power on your Pi, then run `./deploy_to_pi.sh` 🎯
