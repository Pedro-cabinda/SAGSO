const db = require('../config/db');

exports.criarCategoria = async ({ nome, descricao }) => {
  const [result] = await db.execute(
    `INSERT INTO categorias_produtos (nome, descricao) VALUES (?, ?)`,
    [nome, descricao]
  );
  return result.insertId;
};

exports.listarCategorias = async () => {
  const [rows] = await db.execute(`SELECT * FROM categorias_produtos`);
  return rows;
};

exports.buscarPorId = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM categorias_produtos WHERE id = ?`, [id]);
  return rows[0];
};

exports.atualizarCategoria = async (id, { nome, descricao }) => {
  await db.execute(
    `UPDATE categorias_Produtos SET nome = ?, descricao = ? WHERE id = ?`,
    [nome, descricao, id]
  );
};

exports.removerCategoria = async (id) => {
  await db.execute(`DELETE FROM categorias_produtos WHERE id = ?`, [id]);
};
