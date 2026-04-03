/**
 * HTTP API Channel for NanoClaw
 *
 * Exposes a local HTTP server so external programs (.NET, IronPython, etc.)
 * can send messages to agents and receive responses without going through
 * Telegram or any other messaging platform.
 *
 * Messages use JID prefix "api:" — e.g. "api:my-group-folder".
 * The group must be registered with an api: JID pointing to the desired folder.
 *
 * Endpoints:
 *   POST /api/message   — send a message to an agent
 *   GET  /api/response   — poll for buffered responses
 *   GET  /api/health      — health check
 */
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

import { readEnvFile } from '../env.js';
import { logger } from '../logger.js';
import { registerChannel, ChannelOpts } from './registry.js';
import {
  Channel,
  OnChatMetadata,
  OnInboundMessage,
  RegisteredGroup,
} from '../types.js';

const JID_PREFIX = 'api:';
const DEFAULT_PORT = 3847;
const MAX_BODY_SIZE = 1_048_576; // 1 MB

interface BufferedResponse {
  text: string;
  timestamp: string;
}

export class HttpApiChannel implements Channel {
  name = 'http-api';

  private server: Server | null = null;
  private opts: {
    onMessage: OnInboundMessage;
    onChatMetadata: OnChatMetadata;
    registeredGroups: () => Record<string, RegisteredGroup>;
  };
  private port: number;
  private apiKey: string;
  // Buffered responses keyed by group folder
  private responses = new Map<string, BufferedResponse[]>();

  constructor(
    port: number,
    apiKey: string,
    opts: {
      onMessage: OnInboundMessage;
      onChatMetadata: OnChatMetadata;
      registeredGroups: () => Record<string, RegisteredGroup>;
    },
  ) {
    this.port = port;
    this.apiKey = apiKey;
    this.opts = opts;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = createServer((req, res) => this.handleRequest(req, res));

      this.server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          logger.error(
            { port: this.port },
            'HTTP API port already in use',
          );
          reject(err);
        } else {
          logger.error({ err }, 'HTTP API server error');
        }
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        logger.info({ port: this.port }, 'HTTP API channel listening');
        resolve();
      });
    });
  }

  sendMessage(jid: string, text: string): Promise<void> {
    const folder = jid.slice(JID_PREFIX.length);
    const queue = this.responses.get(folder) || [];
    queue.push({ text, timestamp: new Date().toISOString() });
    this.responses.set(folder, queue);
    logger.debug({ folder, length: text.length }, 'HTTP API response buffered');
    return Promise.resolve();
  }

  isConnected(): boolean {
    return this.server?.listening === true;
  }

  ownsJid(jid: string): boolean {
    return jid.startsWith(JID_PREFIX);
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve());
      } else {
        resolve();
      }
    });
  }

  // --- HTTP request handling ---

  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    // CORS headers for browser-based clients
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Health check — no auth required
    if (pathname === '/api/health' && req.method === 'GET') {
      this.jsonResponse(res, 200, { status: 'ok' });
      return;
    }

    // Auth check
    if (!this.authenticate(req)) {
      this.jsonResponse(res, 401, { error: 'Unauthorized' });
      return;
    }

    try {
      if (pathname === '/api/message' && req.method === 'POST') {
        await this.handleSendMessage(req, res);
      } else if (pathname === '/api/response' && req.method === 'GET') {
        this.handleGetResponses(url, res);
      } else {
        this.jsonResponse(res, 404, { error: 'Not found' });
      }
    } catch (err) {
      logger.error({ err, path: pathname }, 'HTTP API request error');
      this.jsonResponse(res, 500, { error: 'Internal server error' });
    }
  }

  private authenticate(req: IncomingMessage): boolean {
    if (!this.apiKey) return true; // No key configured = open (localhost only)
    const auth = req.headers.authorization;
    if (!auth) return false;
    // Support "Bearer <key>" or plain "<key>"
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    return token === this.apiKey;
  }

  /**
   * POST /api/message
   * Body: { group: "folder-name", text: "message", sender?: "name" }
   */
  private async handleSendMessage(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    const body = await this.readBody(req);
    if (!body) {
      this.jsonResponse(res, 400, { error: 'Invalid or missing body' });
      return;
    }

    let data: { group?: string; text?: string; sender?: string };
    try {
      data = JSON.parse(body);
    } catch {
      this.jsonResponse(res, 400, { error: 'Invalid JSON' });
      return;
    }

    if (!data.group || !data.text) {
      this.jsonResponse(res, 400, {
        error: 'Missing required fields: group, text',
      });
      return;
    }

    const jid = JID_PREFIX + data.group;
    const groups = this.opts.registeredGroups();

    if (!groups[jid]) {
      this.jsonResponse(res, 404, {
        error: `Group not registered with JID "${jid}". Register it first.`,
        hint: 'Register the group with JID prefix "api:" pointing to the desired folder.',
      });
      return;
    }

    const msgId = `api-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();
    const senderName = data.sender || 'API Client';

    // Notify chat metadata (updates last activity)
    this.opts.onChatMetadata(jid, timestamp, senderName, 'http-api', false);

    // Deliver the message into NanoClaw's message pipeline
    this.opts.onMessage(jid, {
      id: msgId,
      chat_jid: jid,
      sender: 'api-user',
      sender_name: senderName,
      content: data.text,
      timestamp,
      is_from_me: false,
    });

    logger.info(
      { group: data.group, sender: senderName, msgId },
      'HTTP API message received',
    );

    this.jsonResponse(res, 200, {
      ok: true,
      messageId: msgId,
      group: data.group,
    });
  }

  /**
   * GET /api/response?group=folder-name&wait=5
   * Returns buffered responses and clears them.
   * Optional "wait" param: long-poll seconds (max 30).
   */
  private handleGetResponses(url: URL, res: ServerResponse): void {
    const group = url.searchParams.get('group');
    if (!group) {
      this.jsonResponse(res, 400, { error: 'Missing query param: group' });
      return;
    }

    const waitSec = Math.min(
      30,
      Math.max(0, parseInt(url.searchParams.get('wait') || '0', 10) || 0),
    );

    const drain = (): BufferedResponse[] => {
      const queue = this.responses.get(group) || [];
      if (queue.length > 0) {
        this.responses.delete(group);
      }
      return queue;
    };

    // Immediate check
    const immediate = drain();
    if (immediate.length > 0 || waitSec === 0) {
      this.jsonResponse(res, 200, { responses: immediate });
      return;
    }

    // Long-poll: check periodically until timeout
    const startTime = Date.now();
    const pollInterval = setInterval(() => {
      const responses = drain();
      if (responses.length > 0 || Date.now() - startTime >= waitSec * 1000) {
        clearInterval(pollInterval);
        this.jsonResponse(res, 200, { responses });
      }
    }, 500);

    // Clean up if client disconnects
    res.on('close', () => clearInterval(pollInterval));
  }

  private jsonResponse(
    res: ServerResponse,
    status: number,
    data: unknown,
  ): void {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  private readBody(req: IncomingMessage): Promise<string | null> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > MAX_BODY_SIZE) {
          resolve(null);
          req.destroy();
        }
      });
      req.on('end', () => resolve(body));
      req.on('error', () => resolve(null));
    });
  }
}

// --- Channel registration ---

registerChannel('http-api', (opts: ChannelOpts) => {
  const envVars = readEnvFile(['HTTP_API_PORT', 'HTTP_API_KEY']);
  const portStr =
    process.env.HTTP_API_PORT || envVars.HTTP_API_PORT || '';
  const apiKey = process.env.HTTP_API_KEY || envVars.HTTP_API_KEY || '';

  // Channel is opt-in: only start if port is configured
  if (!portStr) {
    return null;
  }

  const port = parseInt(portStr, 10) || DEFAULT_PORT;
  return new HttpApiChannel(port, apiKey, opts);
});
