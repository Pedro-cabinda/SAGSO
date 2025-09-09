const db = require('../config/db');

exports.criarProduto = async (dados) => {
  const {
    nome,
    descricao,
    categoria_id,
    unidade_medida,
    quantidade_disponivel,
    quantidade_minima,
    data_validade
  } = dados;

  const [result] = await db.execute(`
    INSERT INTO produtos (nome, descricao, categoria_id, unidade_medida, quantidade_disponivel, quantidade_minima, data_validade)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [nome, descricao, categoria_id, unidade_medida, quantidade_disponivel, quantidade_minima, data_validade]);

  return result.insertId;
};

exports.listarProdutos = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.id,
      p.nome,
      p.descricao,
      p.unidade_medida,
      p.quantidade_disponivel,
      p.quantidade_minima,
      p.data_validade,
      p.categoria_id,
      c.nome AS categoria_nome
    FROM produtos p
    JOIN categorias_produtos c ON p.categoria_id = c.id
  `);
  return rows;
};

exports.buscarPorId = async (id) => {
  const [rows] = await db.execute('SELECT * FROM produtos WHERE id = ?', [id]);
  return rows[0];
};

exports.atualizarProduto = async (id, dados) => {
  const {
    nome,
    descricao,
    categoria_id,
    unidade_medida,
    quantidade_minima,
    data_validade
  } = dados;

  await db.execute(`
    UPDATE produtos SET
      nome = ?, descricao = ?, categoria_id = ?, unidade_medida = ?,
      quantidade_minima = ?, data_validade = ?
    WHERE id = ?
  `, [
    nome ?? null,
    descricao ?? null,
    categoria_id ?? null,
    unidade_medida ?? null,
    quantidade_minima ?? null,
    data_validade ?? null,
    id
  ]);
};


exports.removerProduto = async (id) => {
  await db.execute('DELETE FROM produtos WHERE id = ?', [id]);
};


exports.subtrairDoEstoque = async (produtoId, quantidade, conn = db) => {
  await conn.execute(`
    UPDATE produtos
    SET quantidade_disponivel = quantidade_disponivel - ?
    WHERE id = ?
  `, [quantidade, produtoId]);
};

exports.buscarPorId = async (id, conn = db) => {
  const [rows] = await conn.execute('SELECT * FROM produtos WHERE id = ?', [id]);
  return rows[0];
};


// Retorna os produtos mais usados em atendimentos
exports.produtosMaisUsados = async () => {
  const [rows] = await db.execute(`
    SELECT 
      p.nome AS produto,
      SUM(ap.quantidade) AS total_usado
    FROM atendimentos_produtos ap
    JOIN produtos p ON ap.produto_id = p.id
    GROUP BY p.nome
    ORDER BY total_usado DESC
  `);

  return rows;
};
