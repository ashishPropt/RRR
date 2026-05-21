#!/bin/bash
# Deploy / update script — run on the Vultr VPS
set -euo pipefail

cd /opt/rrr

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Rebuilding containers ==="
docker compose build --no-cache

echo "=== Restarting services ==="
docker compose down
docker compose up -d

echo "=== Waiting for health check ==="
sleep 10
docker compose ps

echo "=== Deploy complete ==="
