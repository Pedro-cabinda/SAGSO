const db = require('../config/db');

// 🔹 Criar atendimento
exports.criar = async (atendimentoData) => {
  const {
    paciente_id,
    tipo_paciente,
    dataHora,
    sintomas,
    diagnostico,
    profissional_id,
    produtos_utilizados = []
  } = atendimentoData;

  const conn = await db.getConnection();

  try {
    // 🔍 Verificar estoque dos produtos antes da transação
    for (const produto of produtos_utilizados) {
      const { produto_id, quantidade } = produto;
      const [[produtoAtual]] = await conn.query(
        'SELECT quantidade_disponivel, quantidade_minima, nome FROM produtos WHERE id = ?',
        [produto_id]
      );

      if (!produtoAtual) {
        return { erro: true, mensagem: `Produto com ID ${produto_id} não encontrado.` };
      }

      if (produtoAtual.quantidade_disponivel < produtoAtual.quantidade_minima || produtoAtual.quantidade_disponivel < quantidade) {
        return {
          erro: true,
          mensagem: `Não Existe Estoque Suficiente Para "${produtoAtual.nome}". Disponível: ${produtoAtual.quantidade_disponivel}`
        };
      }
    }

    await conn.beginTransaction();

    // 📝 Inserir atendimento
    const [resultado] = await conn.query(
      `INSERT INTO atendimentos (
        paciente_id,
        data_atendimento,
        sintomas,
        diagnostico,
        profissional_id
      ) VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, dataHora, sintomas, diagnostico, profissional_id]
    );

    const atendimentoId = resultado.insertId;

    // 📦 Inserir produtos utilizados, atualizar estoque e registrar saída
    for (const produto of produtos_utilizados) {
      const { produto_id, quantidade } = produto;

      // 1️⃣ Inserir no atendimento_produtos
      await conn.query(
        `INSERT INTO atendimentos_produtos (atendimento_id, produto_id, quantidade)
         VALUES (?, ?, ?)`,
        [atendimentoId, produto_id, quantidade]
      );

      // 2️⃣ Atualizar estoque
      await conn.query(
        `UPDATE produtos SET quantidade_disponivel = quantidade_disponivel - ? WHERE id = ?`,
        [quantidade, produto_id]
      );

      // 3️⃣ Registrar saída na tabela 'saidas'
      await conn.query(
        `INSERT INTO saidas_estoque (produto_id, quantidade, destino, data_saida, motivo_movimentacao,usuario_id)
         VALUES (?, ?, ?, ?, ?,?)`,
        [produto_id, quantidade, 'Atendimento', dataHora || new Date(), 'Uso em atendimento', profissional_id]
      );
    }

    await conn.commit();

    return { erro: false, atendimentoId, mensagem: 'Atendimento criado com sucesso.' };

  } catch (erro) {
    await conn.rollback();
    console.error(erro);
    return { erro: true, mensagem: 'Erro interno ao criar atendimento.' };
  } finally {
    conn.release();
  }
};

// 🔹 Atualizar atendimento
exports.atualizar = async (atendimentoId, atendimentoData) => {
  const {
    paciente_id,
    dataHora,
    sintomas,
    diagnostico,
    profissional_id,
    produtos_utilizados = []
  } = atendimentoData;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 🔁 Recuperar produtos antigos para reverter estoque
    const [produtosAntigos] = await conn.query(
      'SELECT produto_id, quantidade FROM atendimentos_produtos WHERE atendimento_id = ?',
      [atendimentoId]
    );

    for (const produto of produtosAntigos) {
      // Reverter estoque
      await conn.query(
        'UPDATE produtos SET quantidade_disponivel = quantidade_disponivel + ? WHERE id = ?',
        [produto.quantidade, produto.produto_id]
      );
      // Inserir saída reversa na tabela 'saidas' caso queira histórico de ajuste
      await conn.query(
        `INSERT INTO saidas_estoque (produto_id, quantidade, destino, data_saida, motivo_movimentacao,usuario_id)
         VALUES (?, ?, ?, ?, ?,?)`,
        [produto.produto_id, produto.quantidade, 'Atendimento Atualizado', new Date(), 'Reversão de atendimento anterior', profissional_id || null]
      );
    }

    // ❌ Apagar produtos antigos
    await conn.query(
      'DELETE FROM atendimentos_produtos WHERE atendimento_id = ?',
      [atendimentoId]
    );

    // ✅ Atualizar dados do atendimento
    await conn.query(
      `UPDATE atendimentos SET
        paciente_id = ?,
        data_atendimento = ?,
        sintomas = ?,
        diagnostico = ?,
        profissional_id = ?
      WHERE id = ?`,
      [paciente_id, dataHora, sintomas, diagnostico, profissional_id, atendimentoId]
    );

    // 🔍 Verificar estoque dos novos produtos
    for (const produto of produtos_utilizados) {
      const { produto_id, quantidade } = produto;
      const [[produtoAtual]] = await conn.query(
        'SELECT quantidade_disponivel, quantidade_minima, nome FROM produtos WHERE id = ?',
        [produto_id]
      );

      if (!produtoAtual) {
        await conn.rollback();
        return { erro: true, mensagem: `Produto com ID ${produto_id} não encontrado.` };
      }

      if (produtoAtual.quantidade_disponivel < produtoAtual.quantidade_minima || produtoAtual.quantidade_disponivel < quantidade) {
        await conn.rollback();
        return {
          erro: true,
          mensagem: `Não Existe Estoque Suficiente Para "${produtoAtual.nome}". Disponível: ${produtoAtual.quantidade_disponivel}`
        };
      }
    }

    // 📦 Inserir novos produtos, atualizar estoque e registrar saída
    for (const produto of produtos_utilizados) {
      const { produto_id, quantidade } = produto;

      await conn.query(
        `INSERT INTO atendimentos_produtos (atendimento_id, produto_id, quantidade)
         VALUES (?, ?, ?)`,
        [atendimentoId, produto_id, quantidade]
      );

      await conn.query(
        `UPDATE produtos SET quantidade_disponivel = quantidade_disponivel - ? WHERE id = ?`,
        [quantidade, produto_id]
      );

      await conn.query(
        `INSERT INTO saidas_estoque (produto_id, quantidade, destino, data_saida, motivo_movimentacao,usuario_id)
         VALUES (?, ?, ?, ?, ?,?)`,
        [produto_id, quantidade, 'Atendimento', dataHora || new Date(), 'Uso em atendimento', profissional_id || null]
      );
    }

    await conn.commit();

    return { erro: false, mensagem: 'Atendimento atualizado com sucesso.' };

  } catch (erro) {
    await conn.rollback();
    console.error(erro);
    return { erro: true, mensagem: 'Erro interno ao atualizar atendimento.' };
  } finally {
    conn.release();
  }
};

// 🔹 Buscar atendimento por ID
exports.buscarPorId = async (id) => {
  const [rows] = await db.execute('SELECT * FROM atendimentos WHERE id = ?', [id]);
  return rows[0];
};

// 🔹 Excluir atendimento
exports.excluir = async (id) => {
  const [result] = await db.execute('DELETE FROM atendimentos WHERE id = ?', [id]);
  return result.affectedRows;
};

// 🔹 Listar atendimentos
exports.listar = async () => {
  const [rows] = await db.execute(`
    SELECT 
      a.id,
      a.data_atendimento,
      a.sintomas,
      a.diagnostico,
      a.encaminhamento,
      p.id AS paciente_id,
      p.nome AS paciente_nome,
      p.numero_estudante_funcionario,
      p.curso_departamento_id,
      cd.nome AS curso_departamento,
      p.tipo_paciente,
      p.data_nascimento,
      p.genero,
      p.email,
      p.telefone,
      u.id AS profissional_id,
      u.nome AS profissional_nome,
      GROUP_CONCAT(DISTINCT pr.nome SEPARATOR ', ') AS produtos_usados
    FROM atendimentos a
    LEFT JOIN pacientes p ON a.paciente_id = p.id
    LEFT JOIN curso_departamento cd ON p.curso_departamento_id = cd.id
    LEFT JOIN usuarios u ON a.profissional_id = u.id
    LEFT JOIN atendimentos_produtos ap ON ap.atendimento_id = a.id
    LEFT JOIN produtos pr ON pr.id = ap.produto_id
    GROUP BY a.id
    ORDER BY a.data_atendimento DESC
  `);
  return rows;
};

// 🔹 Buscar histórico por número de matrícula
exports.buscarHistoricoPorNumeroMatricula = async (numeroMatricula) => {
  const [rows] = await db.execute(`
    SELECT 
      a.id,
      a.data_atendimento,
      a.sintomas,
      a.diagnostico,
      a.encaminhamento,
      u.nome AS profissional_nome,
      GROUP_CONCAT(DISTINCT pr.nome SEPARATOR ', ') AS medicamentos
    FROM atendimentos a
    INNER JOIN pacientes p ON a.paciente_id = p.id
    LEFT JOIN usuarios u ON a.profissional_id = u.id
    LEFT JOIN atendimentos_produtos ap ON ap.atendimento_id = a.id
    LEFT JOIN produtos pr ON pr.id = ap.produto_id
    WHERE p.numero_estudante_funcionario = ?
    GROUP BY a.id
    ORDER BY a.data_atendimento DESC
  `, [numeroMatricula]);
  return rows;
};

// 🔹 Filtrar atendimentos
exports.filtrarAtendimentos = async (data, nome, profissional) => {
  let query = `
    SELECT 
      a.id,
      a.data_atendimento,
      a.sintomas,
      a.diagnostico,
      a.encaminhamento,
      u.id AS profissional_id,
      u.nome AS profissional_nome,
      p.id AS paciente_id,
      p.nome AS paciente_nome,
      GROUP_CONCAT(DISTINCT pr.nome SEPARATOR ', ') AS medicamentos
    FROM atendimentos a
    JOIN pacientes p ON a.paciente_id = p.id
    JOIN usuarios u ON a.profissional_id = u.id
    LEFT JOIN atendimentos_produtos ap ON ap.atendimento_id = a.id
    LEFT JOIN produtos pr ON pr.id = ap.produto_id
    WHERE 1=1
  `;

  const params = [];

  if (data && data.trim() !== '') {
    query += ' AND DATE(a.data_atendimento) = ?';
    params.push(data);
  }

  if (nome && nome.trim() !== '') {
    query += ' AND p.nome LIKE ?';
    params.push(`%${nome}%`);
  }

  if (profissional && profissional.trim() !== '') {
    query += ' AND u.nome LIKE ?';
    params.push(`%${profissional}%`);
  }

  query += ' GROUP BY a.id ORDER BY a.data_atendimento DESC';

  const [rows] = await db.query(query, params);
  return rows;
};

// 🔹 Buscar produtos de um atendimento específico
exports.buscarProdutosDoAtendimento = async (atendimentoId) => {
  const [rows] = await db.execute(`
    SELECT ap.quantidade, p.id, p.nome
    FROM atendimentos_produtos ap
    JOIN produtos p ON ap.produto_id = p.id
    WHERE ap.atendimento_id = ?
  `, [atendimentoId]);
  return rows;
};
