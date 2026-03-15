@echo off
:: Start NanoClaw in WSL (runs in background, window can be closed)
echo Starting NanoClaw...
wsl -d Ubuntu -- bash -c "cd /mnt/a/AI/NanoClaw && bash start-nanoclaw.sh && echo NanoClaw started successfully && sleep 2"
echo.
echo NanoClaw is running in WSL. You can close this window.
pause
