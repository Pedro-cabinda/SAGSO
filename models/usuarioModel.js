const db = require('../config/db');

// Buscar um usuário por email (login)
async function buscarPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

// Criar novo usuário
async function criarUsuario({ nome, email, senha, tipo }) {
  const [result] = await db.query(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  );
  return result.insertId;
}

// Listar todos os profissionais (ex: médicos e enfermeiros)
async function listarProfissionais() {
  const [rows] = await db.query(
    "SELECT id, nome FROM usuarios WHERE tipo IN ('médico', 'enfermeiro')"
  );
  return rows;
}

module.exports = {
  buscarPorEmail,
  criarUsuario,
  listarProfissionais
};
