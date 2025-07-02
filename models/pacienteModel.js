const db = require('../config/db');

exports.criar = async (paciente) => {
  const [result] = await db.execute(
    `INSERT INTO pacientes 
    (nome, data_nascimento, genero, email, telefone, numero_estudante_funcionario, curso_departamento, tipo_paciente) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      paciente.nome,
      paciente.data_nascimento,
      paciente.genero,
      paciente.email,
      paciente.telefone,
      paciente.numero_estudante_funcionario,
      paciente.curso_departamento,
      paciente.tipo_paciente
    ]
  );
  return result.insertId;
};

exports.listar = async () => {
  const [rows] = await db.execute('SELECT * FROM pacientes ORDER BY id DESC');
  return rows;
};

exports.buscarPorId = async (id) => {
  const [rows] = await db.execute('SELECT * FROM pacientes WHERE id = ?', [id]);
  return rows[0];
};

exports.atualizar = async (id, paciente) => {
  const [result] = await db.execute(
    `UPDATE pacientes SET 
     nome = ?, data_nascimento = ?, genero = ?, email = ?, telefone = ?, 
     numero_estudante_funcionario = ?, curso_departamento = ?, tipo_paciente = ? 
     WHERE id = ?`,
    [
      paciente.nome,
      paciente.data_nascimento,
      paciente.genero,
      paciente.email,
      paciente.telefone,
      paciente.numero_estudante_funcionario,
      paciente.curso_departamento,
      paciente.tipo_paciente,
      id
    ]
  );
  return result.affectedRows;
};

exports.excluir = async (id) => {
  const [result] = await db.execute('DELETE FROM pacientes WHERE id = ?', [id]);
  return result.affectedRows;
};

