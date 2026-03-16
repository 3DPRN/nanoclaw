#!/bin/bash
cd /mnt/a/AI/NanoClaw

# Kill any existing NanoClaw process
kill $(cat nanoclaw.pid 2>/dev/null) 2>/dev/null
fuser -k 3001/tcp 2>/dev/null
sleep 1

# Refresh OAuth token from Claude Code credentials
CRED_FILE="$HOME/.claude/.credentials.json"
if [ -f "$CRED_FILE" ]; then
  TOKEN=$(python3 -c "import json; print(json.load(open('$CRED_FILE'))['claudeAiOauth']['accessToken'])" 2>/dev/null)
  if [ -n "$TOKEN" ]; then
    sed -i "s|^CLAUDE_CODE_OAUTH_TOKEN=.*|CLAUDE_CODE_OAUTH_TOKEN=$TOKEN|" .env
  fi
fi

# Start NanoClaw in background
nohup npm start > nohup.out 2>&1 &
echo $! > nanoclaw.pid
echo "NanoClaw avviato (PID: $(cat nanoclaw.pid))"

# Wait a moment then launch Claude Code interactively
sleep 2
exec claude --dangerously-skip-permissions
