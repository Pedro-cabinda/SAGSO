const Entrada = require('../models/entradaEstoqueModel');

// Criar nova entrada
exports.criar = async (req, res) => {
  try {
    const id = await Entrada.registrarEntrada(req.body);
    res.status(201).json({ mensagem: 'Entrada registrada com sucesso', id });
  } catch (err) {
    console.error('Erro ao registrar entrada:', err);
    res.status(500).json({ 
      erro: err.message || 'Erro ao registrar entrada' 
    });
  }
};

// Listar entradas com filtros opcionais
exports.listar = async (req, res) => {
  try {
    const filtros = {
      produto_id: req.query.produto_id,
      inicio: req.query.inicio,
      fim: req.query.fim
    };
    const entradas = await Entrada.listarEntradas(filtros);
    res.json(entradas);
  } catch (err) {
    console.error('Erro ao listar entradas:', err);
    res.status(500).json({ 
      erro: err.message || 'Erro ao listar entradas' 
    });
  }
};

// Relatório mensal de entradas
exports.relatorioMensal = async (_req, res) => {
  try {
    const dados = await Entrada.relatorioMensal();
    res.json(dados);
  } catch (err) {
    console.error('Erro ao gerar relatório mensal:', err);
    res.status(500).json({ 
      erro: err.message || 'Erro ao gerar relatório mensal de entradas' 
    });
  }
};

// Atualizar entrada existente
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await Entrada.atualizarEntrada(id, req.body);

    if (!atualizado) {
      return res.status(404).json({ erro: 'Entrada não encontrada' });
    }

    res.json({ mensagem: 'Entrada atualizada com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar entrada:', err);
    res.status(500).json({ 
      erro: err.message || 'Erro ao atualizar entrada' 
    });
  }
};
