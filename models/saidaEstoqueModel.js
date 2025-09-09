const db = require('../config/db');

exports.registrarSaida = async (dados) => {
  const conn = await db.getConnection(); // pega conexão para transação
  try {
    await conn.beginTransaction();

    // 1️⃣ Verificar estoque disponível
    const [[produto]] = await conn.execute(
      `SELECT quantidade_disponivel FROM produtos WHERE id = ?`,
      [dados.produto_id]
    );

    if (!produto) {
      throw new Error('Produto não encontrado.');
    }

    if (produto.quantidade_disponivel < dados.quantidade) {
      throw new Error('Estoque insuficiente para esta saída.');
    }

    // 2️⃣ Garantir data válida
    const dataSaida = dados.data_saida || new Date();

    // 3️⃣ Registrar saída
    await conn.execute(
      `INSERT INTO saidas (produto_id, quantidade, destino, data_saida,motivo_movimetacao,observacao,usuario_id)
       VALUES (?, ?, ?, ?, ?,?,?)`,
      [
        dados.produto_id,
        dados.quantidade,
        dados.destino || null,
        dataSaida,
        dados.motivo_movimetacao,
        dados.observacao || null,
        dados.usuario_id // precisa vir do front (ex.: req.user.id)
      ]
    );

    // 4️⃣ Atualizar estoque
    await conn.execute(
      `UPDATE produtos
       SET quantidade_disponivel = quantidade_disponivel - ?
       WHERE id = ?`,
      [dados.quantidade, dados.produto_id]
    );

    await conn.commit();
    return { mensagem: 'Saída registrada com sucesso!' };

  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

exports.listarSaidas = async () => {
  const [rows] = await db.execute(
    `S s.id, 
    p.nome AS produto, 
    s.quantidade, 
    s.destino, 
    s.data_saida, 
    s.observacoes,
    u.nome AS usuario
 FROM saidas_estoque s
 JOIN produtos p ON s.produto_id = p.id
 LEFT JOIN usuarios u ON s.usuario_id = u.id
 ORDER BY s.data_saida DESC`
  );
  return rows;
};

exports.relatorioMensal = async () => {
  const [rows] = await db.execute(
    `SELECT DATE_FORMAT(s.data_saida, '%Y-%m') AS mes,
            SUM(s.quantidade) AS total_saidas
     FROM saidas s
     GROUP BY mes
     ORDER BY mes DESC`
  );
  return rows;
};
