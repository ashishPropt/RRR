#!/bin/bash
exec > /var/log/rrr-setup.log 2>&1
set -euo pipefail
echo "=== RRR Setup Started: $(date) ==="
export DEBIAN_FRONTEND=noninteractive

# Inject SSH public key for passwordless access
mkdir -p /root/.ssh
chmod 700 /root/.ssh
echo "SSH_PUB_KEY_PLACEHOLDER" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
echo "SSH key injected"

# System packages
apt-get update -y
apt-get install -y ca-certificates curl gnupg git
echo "Base packages installed"

# Docker Engine
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
. /etc/os-release
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable docker
systemctl start docker
docker --version
echo "Docker installed OK"

# Clone repo
mkdir -p /opt/rrr
git clone https://github.com/ashishPropt/RRR.git /opt/rrr
cd /opt/rrr
git log --oneline -3
echo "Repo cloned"

# Write .env
cat > /opt/rrr/.env << 'ENVEOF'
DB_PASSWORD=DB_PASS_PLACEHOLDER
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nataliecabinda@gmail.com
SMTP_PASS=
CONTACT_EMAIL=nataliecabinda@gmail.com
FRONTEND_URL=http://localhost
VITE_API_URL=
ENVEOF

cp /opt/rrr/.env /opt/rrr/backend/.env
echo ".env written"

# Start containers
cd /opt/rrr
docker compose up -d --build
echo "Docker compose up: $(date)"
docker compose ps
echo "=== RRR Setup Complete: $(date) ==="
