import { run, get } from '../db/sqlite';

export interface Account {
  id?: number;
  email: string;
  passwordHash: string;
}

export async function createAccount(account: Account): Promise<void> {
  await run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [
    account.email,
    account.passwordHash,
  ]);
}

export async function findAccountByEmail(email: string): Promise<Account | undefined> {
  const row = await get<Account>('SELECT * FROM users WHERE email = ?', [email]);
  return row as Account | undefined;
}
