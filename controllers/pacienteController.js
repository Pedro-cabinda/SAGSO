const Paciente = require('../models/pacienteModel');

// Criar paciente
exports.criar = async (req, res) => {
  
  try {
    const id = await Paciente.criar(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (err) {
    console.error('Erro ao criar paciente:', err);
    res.status(500).json({ erro: 'Erro ao criar paciente' });
  }
};

// Listar todos os pacientes (com JOIN mostrando curso/departamento)
exports.listar = async (_req, res) => {
  try {
    const pacientes = await Paciente.listarPacientes();
    res.json(pacientes);
  } catch (err) {
    console.error('Erro ao listar pacientes:', err);
    res.status(500).json({ erro: 'Erro ao listar pacientes' });
  }
};



exports.getFuncionarios = async (req, res) => {
  try {
    const funcionarios = await Paciente.listarFuncionarios(); // ✅ usar o mesmo nome do import
    res.json(funcionarios);
  } catch (error) {
    console.error('Erro ao carregar funcionários:', error.message);
    res.status(500).json({ erro: true, mensagem: 'Erro ao carregar funcionários.' });
  }
};


// Buscar paciente por ID
exports.buscarPorId = async (req, res) => {
  try {
    const paciente = await Paciente.buscarPorId(req.params.id);
    if (!paciente) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json(paciente);
  } catch (err) {
    console.error('Erro ao buscar paciente:', err);
    res.status(500).json({ erro: 'Erro ao buscar paciente' });
  }
};

// Buscar paciente por matrícula
exports.buscarPorMatricula = async (req, res) => {
  try {
    const paciente = await Paciente.buscarPorMatricula(req.params.numero);
    if (!paciente) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json(paciente);
  } catch (err) {
    console.error('Erro ao buscar paciente por matrícula:', err);
    res.status(500).json({ erro: 'Erro ao buscar paciente por matrícula' });
  }
};

// Atualizar paciente
exports.atualizar = async (req, res) => {
  try {
    const alterado = await Paciente.atualizar(req.params.id, req.body);
    if (!alterado) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json({ mensagem: 'Paciente atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar paciente:', err);
    res.status(500).json({ erro: 'Erro ao atualizar paciente' });
  }
};

// Excluir paciente
exports.excluir = async (req, res) => {
  try {
    const excluido = await Paciente.excluir(req.params.id);
    if (!excluido) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json({ mensagem: 'Paciente excluído com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir paciente:', err);
    res.status(500).json({ erro: 'Erro ao excluir paciente' });
  }
};
