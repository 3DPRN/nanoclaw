#!/usr/bin/env bash
# NanoClaw watchdog — checks heartbeat file staleness.
# If the message loop hasn't updated the heartbeat in MAX_STALE_SEC,
# the process is killed and restarted.
#
# Usage: run via cron every 2 minutes:
#   */2 * * * * /mnt/a/AI/NanoClaw/scripts/watchdog.sh

set -euo pipefail

PROJECT_DIR="/mnt/a/AI/NanoClaw"
HEARTBEAT_FILE="$PROJECT_DIR/data/heartbeat"
PID_FILE="$PROJECT_DIR/nanoclaw.pid"
LOG_FILE="$PROJECT_DIR/nohup.out"
MAX_STALE_SEC=120  # 2 minutes

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [watchdog] $*" >> "$LOG_FILE"
}

# Check if process is running
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  # The PID file may point to the wrapper shell; find the actual node process
  NODE_PID=$(pgrep -f "node dist/index.js" || true)
  if [ -z "$NODE_PID" ]; then
    log "Process not running (PID $PID dead). Restarting..."
  else
    # Process is running — check heartbeat
    if [ ! -f "$HEARTBEAT_FILE" ]; then
      log "No heartbeat file found. Restarting..."
    else
      HEARTBEAT=$(cat "$HEARTBEAT_FILE")
      NOW=$(date +%s%3N)
      AGE_MS=$(( NOW - HEARTBEAT ))
      AGE_SEC=$(( AGE_MS / 1000 ))

      if [ "$AGE_SEC" -lt "$MAX_STALE_SEC" ]; then
        # Healthy — nothing to do
        exit 0
      fi

      log "Heartbeat stale (${AGE_SEC}s old, max ${MAX_STALE_SEC}s). Killing PID $NODE_PID..."
      kill "$NODE_PID" 2>/dev/null || true
      sleep 3
      # Force kill if still alive
      kill -0 "$NODE_PID" 2>/dev/null && kill -9 "$NODE_PID" 2>/dev/null || true
    fi
  fi
else
  log "No PID file found. Starting..."
fi

# Start NanoClaw
cd "$PROJECT_DIR"
nohup node dist/index.js >> "$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"
log "Started NanoClaw (PID $!)"
