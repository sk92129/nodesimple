const Database = require("better-sqlite3");

function createDatabase(filename) {
  const db = new Database(filename);

  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  return db;
}

module.exports = { createDatabase };
