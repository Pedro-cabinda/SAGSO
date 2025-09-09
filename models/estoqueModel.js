// src/models/EstoqueModel.js
const db = require('../config/db');

const EstoqueModel = {
  // Lista todas as movimentações (entradas + saídas)
  async listarMovimentacoes() {
    const sql = `
    SELECT 
    'Entrada' AS tipo,
    p.nome AS produto_nome,
    cp.nome AS categoria,
    e.quantidade,
    p.unidade_medida,
    e.data_entrada AS data_movimentacao,
    e.origem AS origem_destino,
    e.motivo_movimentacao,
    p.data_validade AS validade,
    u.nome AS responsavel_movimentacao,
    e.observacoes
FROM entradas_estoque e
JOIN produtos p ON p.id = e.produto_id
JOIN categorias_produtos cp ON cp.id = p.categoria_id
LEFT JOIN usuarios u ON u.id = e.usuario_id

UNION ALL

SELECT 
    'Saída' AS tipo,
    p.nome AS produto_nome,
    cp.nome AS categoria,
    s.quantidade,
    p.unidade_medida,
    s.data_saida AS data_movimentacao,
    s.destino AS origem_destino,
    s.motivo_movimentacao,
    p.data_validade AS validade,
    u.nome AS responsavel_movimentacao,
    s.observacoes
FROM saidas_estoque s
JOIN produtos p ON p.id = s.produto_id
JOIN categorias_produtos cp ON cp.id = p.categoria_id
LEFT JOIN usuarios u ON u.id = s.usuario_id

ORDER BY data_movimentacao DESC;

    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // Filtra movimentações por produto
  async filtrarPorProduto(produtoId) {
    const sql = `
      SELECT id, produto_id, quantidade, data_entrada AS data, 'entrada' AS tipo
      FROM entradas_estoque
      WHERE produto_id = ?
      UNION ALL
      SELECT id, produto_id, quantidade, data_saida AS data, 'saida' AS tipo
      FROM saidas_estoque
      WHERE produto_id = ?
      ORDER BY data DESC
    `;
    const [rows] = await db.query(sql, [produtoId, produtoId]);
    return rows;
  },

  // Filtra movimentações por intervalo de datas
  async filtrarPorData(dataInicio, dataFim) {
    const sql = `
      SELECT id, produto_id, quantidade, data_entrada AS data, 'entrada' AS tipo
      FROM entradas_estoque
      WHERE data_entrada BETWEEN ? AND ?
      UNION ALL
      SELECT id, produto_id, quantidade, data_saida AS data, 'saida' AS tipo
      FROM saidas_estoque
      WHERE data_saida BETWEEN ? AND ?
      ORDER BY data DESC
    `;
    const [rows] = await db.query(sql, [dataInicio, dataFim, dataInicio, dataFim]);
    return rows;
  },

  // Lista movimentações apenas de um tipo (entrada ou saída)
  async listarPorTipo(tipo) {
    let sql;
    if (tipo === 'entrada') {
      sql = `
        SELECT id, produto_id, quantidade, data_entrada AS data, 'entrada' AS tipo
        FROM entradas_estoque
        ORDER BY data DESC
      `;
    } else if (tipo === 'saida') {
      sql = `
        SELECT id, produto_id, quantidade, data_saida AS data, 'saida' AS tipo
        FROM saidas_estoque
        ORDER BY data DESC
      `;
    } else {
      throw new Error('Tipo inválido. Use "entrada" ou "saida".');
    }
    const [rows] = await db.query(sql);
    return rows;
  },

  // Alerta de estoque baixo
  async alertaEstoqueBaixo() {
    const sql = `
      SELECT id, nome, quantidade_disponivel, quantidade_minima, unidade_medida
      FROM produtos
      WHERE quantidade_disponivel < quantidade_minima
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // Histórico detalhado (com nome do produto e origem/destino)
  async listarComDetalhes() {
    const sql = `
      SELECT 
        'entrada' AS tipo,
        e.id AS id_mov,
        e.produto_id,
        p.nome AS produto_nome,
        e.quantidade,
        e.data_entrada AS data_movimentacao,
        e.origem AS origem_destino,
        e.observacoes
      FROM entradas_estoque e
      JOIN produtos p ON p.id = e.produto_id

      UNION ALL

      SELECT 
        'saida' AS tipo,
        s.id AS id_mov,
        s.produto_id,
        p.nome AS produto_nome,
        s.quantidade,
        s.data_saida AS data_movimentacao,
        s.destino AS origem_destino,
        s.observacoes
      FROM saidas_estoque s
      JOIN produtos p ON p.id = s.produto_id

      ORDER BY data_movimentacao DESC
      LIMIT 0, 25;
    `;
    const [rows] = await db.query(sql);
    return rows;
  }
};

module.exports = EstoqueModel;
