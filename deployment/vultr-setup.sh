#!/bin/bash
# Vultr VPS initial setup script
# Run as root on a fresh Ubuntu 22.04 instance
set -euo pipefail

echo "=== RRR Vultr Server Setup ==="

# Update system
apt-get update -y && apt-get upgrade -y

# Install Docker
apt-get install -y ca-certificates curl gnupg lsb-release git
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Enable Docker
systemctl enable docker
systemctl start docker

# Install Certbot for SSL
apt-get install -y certbot python3-certbot-nginx

# Create app directory
mkdir -p /opt/rrr
cd /opt/rrr

# Clone the repo
git clone https://github.com/ashishpropt/RRR.git .

echo ""
echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Copy your .env file to /opt/rrr/.env"
echo "  2. Run: cd /opt/rrr && docker compose up -d"
echo "  3. Set up SSL: certbot --nginx -d yourdomain.com"
