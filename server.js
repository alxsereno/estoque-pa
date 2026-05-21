const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Banco de dados PostgreSQL ─────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Cria tabela se não existir
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS store (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('Banco de dados pronto');
}

app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// ── API de dados ──────────────────────────────────────────────────────

// GET /api/data/:key
app.get('/api/data/:key', async (req, res) => {
  try {
    const result = await pool.query('SELECT value FROM store WHERE key = $1', [req.params.key]);
    if (!result.rows.length) return res.json({ ok: true, value: null });
    res.json({ ok: true, value: JSON.parse(result.rows[0].value) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/data/:key
app.post('/api/data/:key', async (req, res) => {
  try {
    const { value } = req.body;
    await pool.query(`
      INSERT INTO store (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
    `, [req.params.key, JSON.stringify(value)]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/ping
app.get('/api/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`Estoque PA rodando na porta ${PORT}`));
}).catch(err => {
  console.error('Erro ao conectar ao banco:', err);
  process.exit(1);
});
