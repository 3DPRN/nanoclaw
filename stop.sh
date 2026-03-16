#!/bin/bash
cd /mnt/a/AI/NanoClaw

PID=$(cat nanoclaw.pid 2>/dev/null)

if [ -z "$PID" ]; then
  echo "NanoClaw non in esecuzione (nessun PID file)"
  exit 0
fi

if ps -p "$PID" > /dev/null 2>&1; then
  kill "$PID"
  sleep 1
  # Force kill se ancora attivo
  if ps -p "$PID" > /dev/null 2>&1; then
    kill -9 "$PID"
    sleep 1
  fi
  echo "NanoClaw fermato (PID: $PID)"
else
  echo "NanoClaw non in esecuzione (processo $PID non trovato)"
fi

rm -f nanoclaw.pid
fuser -k 3001/tcp 2>/dev/null
