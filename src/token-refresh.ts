/**
 * Periodic OAuth token refresh.
 * Reads the latest token from Claude Code's credentials.json
 * and updates the .env file so the credential proxy picks it up.
 */
import fs from 'fs';
import path from 'path';
import os from 'os';

import { logger } from './logger.js';

const CREDENTIALS_PATH = path.join(os.homedir(), '.claude', '.credentials.json');
const ENV_PATH = path.join(process.cwd(), '.env');
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

let refreshTimer: ReturnType<typeof setInterval> | null = null;

function readOAuthTokenFromCredentials(): string | null {
  try {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
    const creds = JSON.parse(content);
    return creds?.claudeAiOauth?.accessToken || null;
  } catch {
    return null;
  }
}

function updateEnvToken(token: string): boolean {
  try {
    let content = fs.readFileSync(ENV_PATH, 'utf-8');
    const regex = /^CLAUDE_CODE_OAUTH_TOKEN=.*/m;
    if (regex.test(content)) {
      const oldMatch = content.match(regex)?.[0];
      const newLine = `CLAUDE_CODE_OAUTH_TOKEN=${token}`;
      if (oldMatch === newLine) return false; // unchanged
      content = content.replace(regex, newLine);
    } else {
      content += `\nCLAUDE_CODE_OAUTH_TOKEN=${token}\n`;
    }
    fs.writeFileSync(ENV_PATH, content);
    return true;
  } catch (err) {
    logger.error({ err }, 'Failed to update OAuth token in .env');
    return false;
  }
}

export function refreshOAuthToken(): boolean {
  const token = readOAuthTokenFromCredentials();
  if (!token) {
    logger.debug('No OAuth token found in credentials.json, skipping refresh');
    return false;
  }
  const updated = updateEnvToken(token);
  if (updated) {
    logger.info('OAuth token refreshed from credentials.json');
  }
  return updated;
}

export function startTokenRefresh(): void {
  // Initial refresh
  refreshOAuthToken();
  // Periodic refresh
  refreshTimer = setInterval(refreshOAuthToken, REFRESH_INTERVAL);
  logger.info(
    { intervalMinutes: REFRESH_INTERVAL / 60000 },
    'OAuth token auto-refresh started',
  );
}

export function stopTokenRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}
