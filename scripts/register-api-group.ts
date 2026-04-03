#!/usr/bin/env npx tsx
/**
 * Register a group for HTTP API access.
 *
 * Usage:
 *   npx tsx scripts/register-api-group.ts <group-folder>
 *
 * Example:
 *   npx tsx scripts/register-api-group.ts telegram_franky-hr
 *
 * This creates a new registration with JID "api:<folder>" pointing to the
 * same group folder. The agent shares memory, CLAUDE.md, and session with
 * the original channel (Telegram, etc.), but messages come from/go to the
 * HTTP API instead.
 */
import { initDatabase, setRegisteredGroup, getAllRegisteredGroups } from '../src/db.js';

const folder = process.argv[2];
if (!folder) {
  console.error('Usage: npx tsx scripts/register-api-group.ts <group-folder>');
  console.error('');
  console.error('Available registered groups:');
  initDatabase();
  const groups = getAllRegisteredGroups();
  for (const [jid, g] of Object.entries(groups)) {
    console.error(`  ${g.folder}  (${g.name})  [${jid}]`);
  }
  process.exit(1);
}

initDatabase();

const jid = `api:${folder}`;
const existing = getAllRegisteredGroups();

// Check if already registered
if (existing[jid]) {
  console.log(`Already registered: ${jid} → ${existing[jid].folder}`);
  process.exit(0);
}

// Find the original group to copy settings
const original = Object.values(existing).find((g) => g.folder === folder);
const name = original ? `${original.name} (API)` : `API ${folder}`;

setRegisteredGroup(jid, {
  name,
  folder,
  trigger: '@Franky', // No trigger needed for API, but field is required
  added_at: new Date().toISOString(),
  requiresTrigger: false, // API messages always go through
  isMain: false,
});

console.log(`Registered: ${jid} → ${folder}`);
console.log(`Name: ${name}`);
console.log(`Trigger required: no`);
console.log('');
console.log('Restart NanoClaw to pick up the new registration.');
