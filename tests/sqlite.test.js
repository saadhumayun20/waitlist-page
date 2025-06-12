import { test } from 'node:test';
import assert from 'node:assert';
import { createAccount, findAccountByEmail } from '../backend/models/account';
import { unlinkSync } from 'fs';

process.env.SQLITE_DB_PATH = 'test.sqlite';

const cleanup = () => {
  try { unlinkSync('test.sqlite'); } catch {}
};

cleanup();

test('create and retrieve account', async () => {
  await createAccount({ email: 'a@example.com', passwordHash: 'hash' });
  const acc = await findAccountByEmail('a@example.com');
  assert(acc);
  assert.strictEqual(acc?.email, 'a@example.com');
});

cleanup();
