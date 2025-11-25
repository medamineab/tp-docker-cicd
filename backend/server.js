const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Config DB (via variables d'environnement fournies par docker-compose)
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'mydb',
  // optionally: set a connection timeout
});

// Middleware
app.use(cors());
app.use(express.json());

// Simple API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from Backend!',
    timestamp: new Date().toISOString(),
    client: req.get('Origin') || 'unknown',
    success: true
  });
});

// DB endpoint: read table users
app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users;');
    res.json({
      message: 'Data from Database',
      data: result.rows,
      timestamp: new Date().toISOString(),
      success: true
    });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({
      message: 'Database error',
      error: err.message,
      success: false
    });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`API endpoint : http://localhost:${PORT}/api`);
  console.log(`DB endpoint  : http://localhost:${PORT}/db`);
});

