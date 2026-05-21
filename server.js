const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Banco de dados ────────────────────────────────────────────────────
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'estoque.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);

// Cria tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS store (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// ── API de dados ──────────────────────────────────────────────────────

// GET /api/data/:key — lê um valor
app.get('/api/data/:key', (req, res) => {
  const row = db.prepare('SELECT value FROM store WHERE key = ?').get(req.params.key);
  if (!row) return res.json({ ok: true, value: null });
  res.json({ ok: true, value: JSON.parse(row.value) });
});

// POST /api/data/:key — salva um valor
app.post('/api/data/:key', (req, res) => {
  const { value } = req.body;
  db.prepare(`
    INSERT INTO store (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).run(req.params.key, JSON.stringify(value));
  res.json({ ok: true });
});

// GET /api/ping — health check
app.get('/api/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Fallback — serve o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Estoque PA rodando na porta ${PORT}`);
});
