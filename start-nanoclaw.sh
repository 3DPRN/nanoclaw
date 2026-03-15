#!/bin/bash
# start-nanoclaw.sh — Start NanoClaw without systemd
# To stop: kill \$(cat /mnt/a/AI/NanoClaw/nanoclaw.pid)

set -euo pipefail

cd "/mnt/a/AI/NanoClaw"

# Stop existing instance if running
if [ -f "/mnt/a/AI/NanoClaw/nanoclaw.pid" ]; then
  OLD_PID=$(cat "/mnt/a/AI/NanoClaw/nanoclaw.pid" 2>/dev/null || echo "")
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Stopping existing NanoClaw (PID $OLD_PID)..."
    kill "$OLD_PID" 2>/dev/null || true
    sleep 2
  fi
fi

echo "Starting NanoClaw..."
nohup "/usr/bin/node" "/mnt/a/AI/NanoClaw/dist/index.js" \
  >> "/mnt/a/AI/NanoClaw/logs/nanoclaw.log" \
  2>> "/mnt/a/AI/NanoClaw/logs/nanoclaw.error.log" &

echo $! > "/mnt/a/AI/NanoClaw/nanoclaw.pid"
echo "NanoClaw started (PID $!)"
echo "Logs: tail -f /mnt/a/AI/NanoClaw/logs/nanoclaw.log"

# Wait for Telegram to connect, then send startup notification
(
  PID=$(cat "/mnt/a/AI/NanoClaw/nanoclaw.pid")
  for i in $(seq 1 30); do
    grep -q "($PID):.*Telegram bot connected" "/mnt/a/AI/NanoClaw/logs/nanoclaw.log" 2>/dev/null && break
    sleep 1
  done
  source "/mnt/a/AI/NanoClaw/.env"
  curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=6495119053" \
    -d "text=Claw is online and ready." > /dev/null 2>&1
) &
