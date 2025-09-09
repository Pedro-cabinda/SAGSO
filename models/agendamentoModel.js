// models/agendamentoModel.js
const db = require('../config/db');

/* ================== Status possíveis ================== */
const STATUS = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  EM_ANDAMENTO: 'Em andamento',
  REALIZADO: 'Realizado',
  CANCELADO: 'Cancelado',
};

/* ================== Criar agendamento ================== */
exports.criar = async ({ paciente_id, profissional_id, data, hora, motivo, observacoes ,exame ,status}) => {
  const [result] = await db.execute(
    `INSERT INTO agendamentos (paciente_id, profissional_id, data, hora, motivo, observacoes,exame, status)
     VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
    [
      paciente_id,
      profissional_id || 1,
      data || null,
      hora || null,
      motivo || null,
      observacoes|| null,
      exame || null,
      status || STATUS.PENDENTE // agora aceita o valor enviado do controller
    ]
  );
  return result.insertId;
};

/* ================== Listar todos os agendamentos ================== */
exports.listarTodos = async () => {
  const [rows] = await db.execute(`
  SELECT a.*,
  p.nome AS funcionario_nome, p.numero_estudante_funcionario AS funcionario_codigo,
  u.nome AS profissional_nome
FROM agendamentos a
JOIN pacientes p ON p.id = a.paciente_id
JOIN usuarios u ON u.id = a.profissional_id
ORDER BY a.data DESC
  `);

  return rows.map(r => ({
    ...r,
    funcionario: { nome: r.funcionario_nome, matricula: r.funcionario_matricula },
    profissional: { nome: r.profissional_nome }
  }));
};

/* ================== Listar por status ================== */
exports.listarPorStatus = async (status) => {
  const [rows] = await db.execute(
    `SELECT a.*, p.nome AS paciente_nome, u.nome AS profissional_nome
     FROM agendamentos a
     JOIN pacientes p ON p.id = a.paciente_id
     JOIN usuarios u ON u.id = a.profissional_id
     WHERE a.status = ?
     ORDER BY a.data DESC`,
    [status]
  );
  return rows;
};

/* ================== Listar filtrados dinamicamente ================== */
exports.listarFiltrados = async ({ status, paciente_id, funcionario_id }) => {
  let query = `
    SELECT a.*, p.nome AS paciente_nome, u.nome AS profissional_nome
    FROM agendamentos a
    JOIN pacientes p ON p.id = a.paciente_id
    JOIN usuarios u ON u.id = a.profissional_id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }
  if (paciente_id) {
    query += ' AND a.paciente_id = ?';
    params.push(paciente_id);
  }
  if (funcionario_id) {
    query += ' AND a.profissional_id = ?';
    params.push(funcionario_id);
  }

  query += ' ORDER BY a.data DESC';
  const [rows] = await db.execute(query, params);
  return rows;
};

/* ================== Buscar por ID ================== */
exports.buscarPorId = async (id) => {
  const [rows] = await db.execute(
    `SELECT a.*, p.nome AS paciente_nome, u.nome AS profissional_nome
     FROM agendamentos a
     JOIN pacientes p ON p.id = a.paciente_id
     JOIN usuarios u ON u.id = a.profissional_id
     WHERE a.id = ?`,
    [id]
  );
  return rows[0];
};

/* ================== Buscar último agendamento de um paciente ================== */
exports.buscarUltimoAgendamento = async (paciente_id) => {
  const [rows] = await db.execute(
    `SELECT * FROM agendamentos
     WHERE paciente_id = ?
     ORDER BY data DESC
     LIMIT 1`,
    [paciente_id]
  );
  return rows[0];
};

/* ================== Atualizar status ================== */
exports.atualizarStatus = async (id, status) => {
  if (!Object.values(STATUS).includes(status)) {
    throw new Error('Status inválido');
  }
  const [result] = await db.execute(
    `UPDATE agendamentos SET status = ? WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows;
};

/* ================== Atualizar dados do agendamento ================== */
exports.atualizar = async ({ id, paciente_id, profissional_id, data, hora, motivo, exame, observacoes, status }) => {
  const [result] = await db.execute(
    `UPDATE agendamentos
     SET paciente_id = ?, profissional_id = ?, data = ?, hora = ?, motivo = ?, exame = ?, observacoes = ?, status = ?
     WHERE id = ?`,
    [
      paciente_id ?? null,
      profissional_id ?? null,
      data ?? null,
      hora ?? null,
      motivo ?? null,
      exame ?? null,
      observacoes ?? null,
      status ?? STATUS.PENDENTE,
      id ?? null
    ]
  );
  return result.affectedRows;
};


/* ================== Deletar agendamento ================== */
exports.deletar = async (id) => {
  const [result] = await db.execute(`DELETE FROM agendamentos WHERE id = ?`, [id]);
  return result.affectedRows;
};

/* ================== Exportar status ================== */
exports.STATUS = STATUS;
