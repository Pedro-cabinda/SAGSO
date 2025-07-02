const db = require('../config/db');

async function buscarPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

async function criarUsuario({ nome, email, senha, tipo }) {
  const [result] = await db.query(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  );
  return result.insertId;
}

module.exports = { buscarPorEmail, criarUsuario };
