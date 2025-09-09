const db = require('../config/db');

exports.registrarEntrada = async (dados) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO entradas_estoque 
        (produto_id, quantidade, data_entrada, origem, motivo_movimentacao, observacoes, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.produto_id,
        dados.quantidade,
        dados.data_entrada,
        dados.origem,
        dados.motivo_movimentacao,
        dados.observacoes,
        dados.usuario_id // precisa vir do front (ex.: req.user.id)
      ]
    );

    await conn.execute(
      `UPDATE produtos 
       SET quantidade_disponivel = quantidade_disponivel + ? 
       WHERE id = ?`,
      [dados.quantidade, dados.produto_id]
    );

    await conn.commit();
    return result.insertId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};


exports.listarEntradas = async (filtros = {}) => {
  let query = `
    SELECT 
      ee.id,
      ee.produto_id,
      p.nome AS nome_produto,
      p.categoria_id,
      c.nome AS categoria_nome,
      p.descricao,
      p.unidade_medida,
      p.data_validade,
      p.quantidade_disponivel,
      p.quantidade_minima,
      ee.quantidade,
      ee.data_entrada,
      ee.origem,
      ee.motivo_movimentacao,
      ee.observacoes
    FROM entradas_estoque ee
    JOIN produtos p ON ee.produto_id = p.id
    LEFT JOIN categorias_produtos c ON p.categoria_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (filtros.produto_id) {
    query += ' AND ee.produto_id = ?';
    params.push(filtros.produto_id);
  }

  if (filtros.inicio && filtros.fim) {
    query += ' AND ee.data_entrada BETWEEN ? AND ?';
    params.push(filtros.inicio, filtros.fim);
  }

  query += ' ORDER BY ee.data_entrada DESC';

  const [rows] = await db.execute(query, params);
  return rows;
};

exports.atualizarEntrada = async (id, dados) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    console.log('Atualizando entrada id:', id);
    console.log('Dados recebidos:', dados);

    const [entradaAtual] = await conn.execute(
      `SELECT quantidade, produto_id FROM entradas_estoque WHERE id = ?`,
      [id]
    );

    if (entradaAtual.length === 0) {
      throw new Error('Entrada não encontrada');
    }

    const qtdAnterior = Number(entradaAtual[0].quantidade);
    const produtoId = Number(entradaAtual[0].produto_id);

    console.log('Entrada atual:', entradaAtual[0]);

    // Atualizar dados da entrada
    await conn.execute(
      `UPDATE entradas_estoque
       SET produto_id = ?, quantidade = ?, data_entrada = ?, origem = ?, motivo_movimentacao = ?, observacoes = ?, usuario_id = ?
       WHERE id = ?`,
      [
        Number(dados.produto_id),
        Number(dados.quantidade),
        dados.data_entrada,
        dados.origem,
        dados.motivo_movimentacao,
        dados.observacoes,
        Number(dados.usuario_id),
        id
      ]
    );

    // Ajustar estoque
    if (Number(dados.produto_id) !== produtoId) {
      console.log('Produto mudou, ajustando estoque antigo e novo');
      await conn.execute(
        `UPDATE produtos SET quantidade_disponivel = quantidade_disponivel - ? WHERE id = ?`,
        [qtdAnterior, produtoId]
      );
      await conn.execute(
        `UPDATE produtos SET quantidade_disponivel = quantidade_disponivel + ? WHERE id = ?`,
        [Number(dados.quantidade), Number(dados.produto_id)]
      );
    } else if (Number(dados.quantidade) !== qtdAnterior) {
      const diferenca = Number(dados.quantidade) - qtdAnterior;
      console.log('Quantidade mudou, ajustando estoque:', diferenca);
      await conn.execute(
        `UPDATE produtos SET quantidade_disponivel = quantidade_disponivel + ? WHERE id = ?`,
        [diferenca, produtoId]
      );
    }

    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    console.error('Erro ao atualizar entrada:', error);
    throw error;
  } finally {
    conn.release();
  }
};


exports.relatorioMensal = async () => {
  const [rows] = await db.execute(`
    SELECT 
      MONTH(data_entrada) AS mes,
      YEAR(data_entrada) AS ano,
      p.nome AS nome_produto,
      SUM(quantidade) AS total
    FROM entradas_estoque ee
    JOIN produtos p ON ee.produto_id = p.id
    GROUP BY ano, mes, nome_produto
    ORDER BY ano DESC, mes DESC
  `);
  return rows;
};
