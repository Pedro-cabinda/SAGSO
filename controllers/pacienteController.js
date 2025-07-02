const Paciente = require('../models/PacienteModel');

exports.criar = async (req, res) => {
  try {
    const id = await Paciente.criar(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar paciente' });
  }
};

exports.listar = async (_req, res) => {
  try {
    const pacientes = await Paciente.listar();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar pacientes' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const paciente = await Paciente.buscarPorId(req.params.id);
    if (!paciente) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar paciente' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const alterado = await Paciente.atualizar(req.params.id, req.body);
    if (!alterado) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json({ mensagem: 'Paciente atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar paciente' });
  }
};

exports.excluir = async (req, res) => {
  try {
    const excluido = await Paciente.excluir(req.params.id);
    if (!excluido) return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    res.json({ mensagem: 'Paciente excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir paciente' });
  }
};
