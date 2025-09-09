const CursoDepartamento = require('../models/cursoDepartamentoModel');

exports.listar = async (_req, res) => {
  try {
    const dados = await CursoDepartamento.listar();
    res.json(dados);
  } catch (err) {
    console.error('Erro ao listar cursos/departamentos:', err);
    res.status(500).json({ erro: 'Erro ao carregar cursos/departamentos' });
  }
};
