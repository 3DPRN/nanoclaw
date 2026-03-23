#!/bin/bash
cd /mnt/a/AI/NanoClaw

# Kill any existing NanoClaw process
kill $(cat nanoclaw.pid 2>/dev/null) 2>/dev/null
pkill -f "node dist/index.js" 2>/dev/null
fuser -k 3100/tcp 2>/dev/null
sleep 1

CRED_FILE="$HOME/.claude/.credentials.json"

refresh_token() {
  if [ -f "$CRED_FILE" ]; then
    TOKEN=$(python3 -c "import json; print(json.load(open('$CRED_FILE'))['claudeAiOauth']['accessToken'])" 2>/dev/null)
    if [ -n "$TOKEN" ]; then
      sed -i "s|^CLAUDE_CODE_OAUTH_TOKEN=.*|CLAUDE_CODE_OAUTH_TOKEN=$TOKEN|" .env
    fi
  fi
}

# Initial token refresh
refresh_token

# Start NanoClaw with automatic restart loop
while true; do
  echo "[$(date)] Avvio NanoClaw..."
  node dist/index.js >> nohup.out 2>&1 &
  NODE_PID=$!
  echo $NODE_PID > nanoclaw.pid
  echo "[$(date)] NanoClaw avviato (PID: $NODE_PID)"

  # Wait for the process to exit
  wait $NODE_PID
  EXIT_CODE=$?
  echo "[$(date)] NanoClaw terminato (exit code: $EXIT_CODE)" >> nohup.out

  # Refresh token before restart
  refresh_token

  # Brief pause before restart to avoid tight loops
  echo "[$(date)] Riavvio tra 5 secondi..." >> nohup.out
  sleep 5
done &

LOOP_PID=$!
echo $LOOP_PID > nanoclaw.pid
echo "NanoClaw avviato con restart loop (PID: $LOOP_PID)"

# Wait a moment then launch Claude Code interactively
sleep 2
exec claude --dangerously-skip-permissions
