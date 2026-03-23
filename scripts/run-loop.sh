#!/bin/bash
# NanoClaw restart loop — restarts automatically on exit.
# Usage: nohup ./scripts/run-loop.sh > nohup.out 2>&1 &

cd /mnt/a/AI/NanoClaw

CRED_FILE="$HOME/.claude/.credentials.json"

refresh_token() {
  if [ -f "$CRED_FILE" ]; then
    TOKEN=$(python3 -c "import json; print(json.load(open('$CRED_FILE'))['claudeAiOauth']['accessToken'])" 2>/dev/null)
    if [ -n "$TOKEN" ]; then
      sed -i "s|^CLAUDE_CODE_OAUTH_TOKEN=.*|CLAUDE_CODE_OAUTH_TOKEN=$TOKEN|" .env
    fi
  fi
}

cleanup() {
  # Kill any leftover node processes and free the proxy port
  pkill -f "node dist/index.js" 2>/dev/null
  fuser -k 3100/tcp 2>/dev/null
  sleep 1
}

trap 'cleanup; exit 0' SIGTERM SIGINT

while true; do
  cleanup
  refresh_token
  echo "[$(date)] Avvio NanoClaw..."
  node dist/index.js &
  NODE_PID=$!
  wait $NODE_PID
  EXIT_CODE=$?
  echo "[$(date)] NanoClaw terminato (exit code: $EXIT_CODE). Riavvio tra 5 secondi..."
  sleep 5
done
