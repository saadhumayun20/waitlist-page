import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { join } from 'path';

let db: sqlite3.Database | null = null;

function getDbPath() {
  return process.env.SQLITE_DB_PATH ||
    join(process.cwd(), 'backend', 'db', 'users.sqlite');
}

export function getDatabase(): sqlite3.Database {
  if (!db) {
    sqlite3.verbose();
    db = new sqlite3.Database(getDbPath());
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          password_hash TEXT
        )`
      );
    });
  }
  return db;
}

export const run = (sql: string, params: any[] = []) =>
  promisify(getDatabase().run.bind(getDatabase()))(sql, params);

export const get = <T = any>(sql: string, params: any[] = []): Promise<T> =>
  promisify(getDatabase().get.bind(getDatabase()))(sql, params);
