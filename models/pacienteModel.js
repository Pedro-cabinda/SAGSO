const db = require('../config/db');

// Função para converter data dd/mm/yyyy → yyyy-mm-dd
function formatarData(data) {
  if (!data) return null;
  const [dia, mes, ano] = data.split('/');
  if (!dia || !mes || !ano) return null;
  return `${ano}-${mes}-${dia}`;
}

exports.criar = async (dados) => {
  try {
    const {
      nome,
      data_nascimento,
      genero,
      email,
      telefone,
      numero_estudante_funcionario,
      curso_departamento_id,
      tipo_paciente
    } = dados;

    // 🔍 Verificar se já existe paciente com mesma matrícula ou email
    const [pacienteExistente] = await db.execute(
      'SELECT id FROM pacientes WHERE numero_estudante_funcionario = ? OR email = ?',
      [numero_estudante_funcionario, email]
    );

    if (pacienteExistente.length > 0) {
      throw new Error('Paciente já cadastrado com este número de matrícula ou email.');
    }

    // 🔄 Formatar data
    const dataFormatada = formatarData(data_nascimento);

    // 📝 Inserir paciente
    const [result] = await db.execute(`
      INSERT INTO pacientes (
        nome, data_nascimento, genero, email,
        telefone, numero_estudante_funcionario,
        curso_departamento_id, tipo_paciente
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nome ?? null,
      dataFormatada,
      genero ?? null,
      email ?? null,
      telefone ?? null,
      numero_estudante_funcionario ?? null,
      curso_departamento_id ?? null,
      tipo_paciente ?? null
    ]);

    return {
      erro: false,
      id: result.insertId,
      mensagem: 'Paciente criado com sucesso.'
    };

  } catch (error) {
    console.error('Erro ao criar paciente:', error.message);
    return {
      erro: true,
      mensagem: error.message || 'Erro interno ao criar paciente.'
    };
  }
};

exports.listarPacientes = async () => {
  const [rows] = await db.query(`
    SELECT p.*, cd.nome AS curso_ou_departamento, cd.tipo AS tipo_relacao
    FROM pacientes p
    LEFT JOIN curso_departamento cd ON p.curso_departamento_id = cd.id
  `);
  return rows;
};

// 🔹 Buscar apenas funcionários (pacientes com tipo 'funcionario')
exports.listarFuncionarios = async () => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nome, p.numero_estudante_funcionario AS matricula
      FROM pacientes p
      WHERE p.tipo_paciente = 'funcionario'
    `);

    return rows;
  } catch (error) {
    console.error('Erro ao listar funcionários:', error.message);
    throw error;
  }
};

exports.buscarPorId = async (id) => {
  const [rows] = await db.execute(`
    SELECT p.*, cd.nome AS curso_ou_departamento, cd.tipo AS tipo_relacao
    FROM pacientes p
    LEFT JOIN curso_departamento cd ON p.curso_departamento_id = cd.id
    WHERE p.id = ?
  `, [id]);
  return rows[0] || null;
};

exports.atualizar = async (id, dados) => {
  try {
    const dataFormatada = formatarData(dados.data_nascimento);

    const [result] = await db.execute(`
      UPDATE pacientes SET
        nome = ?, data_nascimento = ?, genero = ?, email = ?,
        telefone = ?, numero_estudante_funcionario = ?,
        curso_departamento_id = ?, tipo_paciente = ?
      WHERE id = ?
    `, [
      dados.nome ?? null,
      dataFormatada,
      dados.genero ?? null,
      dados.email ?? null,
      dados.telefone ?? null,
      dados.numero_estudante_funcionario ?? null,
      dados.curso_departamento_id ?? null,
      dados.tipo_paciente ?? null,
      id
    ]);

    return {
      erro: false,
      mensagem: result.affectedRows > 0 ? 'Paciente atualizado com sucesso.' : 'Paciente não encontrado.'
    };

  } catch (error) {
    console.error('Erro ao atualizar paciente:', error.message);
    return {
      erro: true,
      mensagem: error.message || 'Erro interno ao atualizar paciente.'
    };
  }
};

exports.excluir = async (id) => {
  try {
    const [result] = await db.execute('DELETE FROM pacientes WHERE id = ?', [id]);
    return {
      erro: false,
      mensagem: result.affectedRows > 0 ? 'Paciente excluído com sucesso.' : 'Paciente não encontrado.'
    };
  } catch (error) {
    console.error('Erro ao excluir paciente:', error.message);
    return {
      erro: true,
      mensagem: error.message || 'Erro interno ao excluir paciente.'
    };
  }
};

// Buscar múltiplos pacientes por IDs
exports.buscarPorIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  // Filtra IDs válidos
  const validIds = ids.filter(id => id != null);
  if (validIds.length === 0) return [];

  const placeholders = validIds.map(() => '?').join(',');

  const [rows] = await db.execute(
    `SELECT * FROM pacientes WHERE id IN (${placeholders})`,
    validIds
  );

  return rows;
};


exports.buscarPorMatricula = async (numeroMatricula) => {
  const [rows] = await db.execute(`
    SELECT p.*, cd.nome AS curso_ou_departamento, cd.tipo AS tipo_relacao
    FROM pacientes p
    LEFT JOIN curso_departamento cd ON p.curso_departamento_id = cd.id
    WHERE p.numero_estudante_funcionario = ?
  `, [numeroMatricula]);

  return rows[0] || null;
};
