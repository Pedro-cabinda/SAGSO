// controllers/saidaEstoqueController.js

const Saida = require('../models/saidaEstoqueModel');

// Criar nova saída
exports.criar = async (req, res) => {
  try {
    const id = await Saida.registrarSaida(req.body);
    return res.status(201).json({ mensagem: 'Saída registrada com sucesso', id });
  } catch (err) {
    console.error('Erro ao registrar saída:', err);
    return res.status(500).json({ erro: 'Erro ao registrar saída' });
  }
};

// Listar saídas com filtros
exports.listar = async (req, res) => {
  try {
    const filtros = {
      produto_id: req.query.produto_id || null,
      inicio: req.query.inicio || null,
      fim: req.query.fim || null
    };

    const saidas = await Saida.listarSaidas(filtros);
    return res.json(saidas);
  } catch (err) {
    console.error('Erro ao listar saídas:', err);
    return res.status(500).json({ erro: 'Erro ao listar saídas' });
  }
};

// Relatório mensal
exports.relatorioMensal = async (_req, res) => {
  try {
    const dados = await Saida.relatorioMensal();
    return res.json(dados);
  } catch (err) {
    console.error('Erro ao gerar relatório mensal:', err);
    return res.status(500).json({ erro: 'Erro ao gerar relatório mensal' });
  }
};
