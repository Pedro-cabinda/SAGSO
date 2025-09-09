// src/controllers/estoqueController.js

const EstoqueModel = require('../models/estoqueModel');

// Listar todas as movimentações
exports.listarMovimentacoes = async (req, res) => {
  try {
    const dados = await EstoqueModel.listarMovimentacoes();
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({ message: 'Erro ao listar movimentações', error: error.message });
  }
};

// Filtrar movimentações por produto
exports.filtrarPorProduto = async (req, res) => {
  try {
    const { produtoId } = req.params;
    const dados = await EstoqueModel.filtrarPorProduto(produtoId);
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao filtrar por produto:', error);
    res.status(500).json({ message: 'Erro ao filtrar por produto', error: error.message });
  }
};

// Filtrar movimentações por intervalo de datas
exports.filtrarPorData = async (req, res) => {
  try {
    const { dataInicio, dataFim } = req.query;
    const dados = await EstoqueModel.filtrarPorData(dataInicio, dataFim);
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao filtrar por data:', error);
    res.status(500).json({ message: 'Erro ao filtrar por data', error: error.message });
  }
};

// Listar movimentações por tipo (entrada/saida)
exports.listarPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const dados = await EstoqueModel.listarPorTipo(tipo);
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao listar por tipo:', error);
    res.status(400).json({ message: error.message });
  }
};

// Alerta de estoque baixo
exports.alertaEstoqueBaixo = async (req, res) => {
  try {
    const dados = await EstoqueModel.alertaEstoqueBaixo();
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao buscar alerta de estoque baixo:', error);
    res.status(500).json({ message: 'Erro ao buscar alerta de estoque baixo', error: error.message });
  }
};

// Listar movimentações detalhadas
exports.listarComDetalhes = async (req, res) => {
  try {
    const dados = await EstoqueModel.listarComDetalhes();
    res.status(200).json(dados);
  } catch (error) {
    console.error('Erro ao listar movimentações detalhadas:', error);
    res.status(500).json({ message: 'Erro ao listar movimentações detalhadas', error: error.message });
  }
};
