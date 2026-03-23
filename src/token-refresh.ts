/**
 * OAuth token lifecycle management.
 * - Reads access + refresh tokens from Claude Code's credentials.json
 * - Proactively refreshes the access token before it expires
 * - Updates credentials.json with the new token so all consumers pick it up
 * - Falls back to syncing .env for backwards compatibility
 */
import fs from 'fs';
import https from 'https';
import path from 'path';
import os from 'os';

import { logger } from './logger.js';

const CREDENTIALS_PATH = path.join(
  os.homedir(),
  '.claude',
  '.credentials.json',
);
const ENV_PATH = path.join(process.cwd(), '.env');

// Claude Code OAuth constants (from SDK source)
const TOKEN_URL = 'https://platform.claude.com/v1/oauth/token';
const CLIENT_ID = '9d1c250a-e61b-44d9-88ed-5944d1962f5e';

// Refresh 10 minutes before expiry to avoid races
const EXPIRY_BUFFER_MS = 10 * 60 * 1000;
// Check every 5 minutes
const CHECK_INTERVAL_MS = 5 * 60 * 1000;
// Minimum time between refresh attempts (avoid hammering on errors)
const MIN_REFRESH_INTERVAL_MS = 60 * 1000;

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let lastRefreshAttempt = 0;

interface OAuthCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scopes?: string[];
  subscriptionType?: string;
  rateLimitTier?: string;
}

function readCredentials(): OAuthCredentials | null {
  try {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
    const creds = JSON.parse(content);
    const oauth = creds?.claudeAiOauth;
    if (!oauth?.accessToken || !oauth?.refreshToken) return null;
    return oauth;
  } catch {
    return null;
  }
}

function writeCredentials(oauth: OAuthCredentials): void {
  try {
    let creds: Record<string, unknown> = {};
    try {
      creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    } catch {
      // File missing or corrupt — start fresh
    }
    creds.claudeAiOauth = oauth;
    const dir = path.dirname(CREDENTIALS_PATH);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CREDENTIALS_PATH, JSON.stringify(creds, null, 2));
  } catch (err) {
    logger.error({ err }, 'Failed to write credentials.json');
  }
}

function updateEnvToken(token: string): void {
  try {
    let content = fs.readFileSync(ENV_PATH, 'utf-8');
    const regex = /^CLAUDE_CODE_OAUTH_TOKEN=.*/m;
    const newLine = `CLAUDE_CODE_OAUTH_TOKEN=${token}`;
    if (regex.test(content)) {
      content = content.replace(regex, newLine);
    } else {
      content += `\n${newLine}\n`;
    }
    fs.writeFileSync(ENV_PATH, content);
  } catch {
    // Best effort — proxy reads from credentials.json directly
  }
}

/**
 * Exchange a refresh token for a new access token via the OAuth token endpoint.
 */
function exchangeRefreshToken(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token?: string; expires_in: number } | null> {
  return new Promise((resolve) => {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }).toString();

    const url = new URL(TOKEN_URL);
    const req = https.request(
      {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString();
          try {
            const data = JSON.parse(raw);
            if (data.error) {
              logger.error(
                { error: data.error },
                'OAuth token refresh failed',
              );
              resolve(null);
              return;
            }
            if (!data.access_token) {
              logger.error({ raw }, 'OAuth token refresh: no access_token in response');
              resolve(null);
              return;
            }
            resolve(data);
          } catch (err) {
            logger.error({ err, raw }, 'Failed to parse token refresh response');
            resolve(null);
          }
        });
      },
    );

    req.on('error', (err) => {
      logger.error({ err }, 'OAuth token refresh request failed');
      resolve(null);
    });

    req.write(body);
    req.end();
  });
}

/**
 * Check if the token needs refreshing and refresh it if so.
 * Returns true if a new token was obtained.
 */
export async function refreshOAuthToken(): Promise<boolean> {
  const creds = readCredentials();
  if (!creds) {
    logger.debug('No OAuth credentials found, skipping refresh');
    return false;
  }

  // Check if token is about to expire
  const now = Date.now();
  if (creds.expiresAt && now + EXPIRY_BUFFER_MS < creds.expiresAt) {
    // Token still fresh — no need to refresh
    return false;
  }

  // Rate limit refresh attempts
  if (now - lastRefreshAttempt < MIN_REFRESH_INTERVAL_MS) {
    logger.debug('Skipping token refresh — too soon since last attempt');
    return false;
  }
  lastRefreshAttempt = now;

  logger.info(
    {
      expiresAt: creds.expiresAt
        ? new Date(creds.expiresAt).toISOString()
        : 'unknown',
    },
    'OAuth token expiring soon, refreshing...',
  );

  const result = await exchangeRefreshToken(creds.refreshToken);
  if (!result) return false;

  // Update credentials
  const newCreds: OAuthCredentials = {
    ...creds,
    accessToken: result.access_token,
    expiresAt: now + result.expires_in * 1000,
  };
  // Some providers rotate refresh tokens
  if (result.refresh_token) {
    newCreds.refreshToken = result.refresh_token;
  }

  writeCredentials(newCreds);
  updateEnvToken(result.access_token);

  logger.info(
    {
      expiresAt: new Date(newCreds.expiresAt).toISOString(),
      tokenPrefix: result.access_token.slice(0, 20) + '...',
    },
    'OAuth token refreshed successfully',
  );

  return true;
}

/**
 * Force a token refresh (e.g. after a 401 error).
 * Bypasses the expiry check but respects rate limiting.
 */
export async function forceRefreshOAuthToken(): Promise<boolean> {
  const creds = readCredentials();
  if (!creds) return false;

  const now = Date.now();
  if (now - lastRefreshAttempt < MIN_REFRESH_INTERVAL_MS) {
    logger.debug('Skipping forced token refresh — too soon since last attempt');
    return false;
  }
  lastRefreshAttempt = now;

  logger.info('Force-refreshing OAuth token after auth failure');
  const result = await exchangeRefreshToken(creds.refreshToken);
  if (!result) return false;

  const newCreds: OAuthCredentials = {
    ...creds,
    accessToken: result.access_token,
    expiresAt: now + result.expires_in * 1000,
  };
  if (result.refresh_token) {
    newCreds.refreshToken = result.refresh_token;
  }

  writeCredentials(newCreds);
  updateEnvToken(result.access_token);

  logger.info('OAuth token force-refreshed successfully');
  return true;
}

export function startTokenRefresh(): void {
  // Initial check
  refreshOAuthToken().catch((err) =>
    logger.error({ err }, 'Initial token refresh failed'),
  );

  // Periodic check
  refreshTimer = setInterval(() => {
    refreshOAuthToken().catch((err) =>
      logger.error({ err }, 'Periodic token refresh failed'),
    );
  }, CHECK_INTERVAL_MS);

  logger.info(
    { checkIntervalMinutes: CHECK_INTERVAL_MS / 60000 },
    'OAuth token auto-refresh started',
  );
}

export function stopTokenRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}
