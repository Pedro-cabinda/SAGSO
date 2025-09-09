const Categoria = require('../models/categoriaModel');

exports.criar = async (req, res) => {
  try {
    const id = await Categoria.criarCategoria(req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ erro: 'Erro ao criar categoria' });
  }
};

exports.listar = async (req, res) => {
  try {
    const categorias = await Categoria.listarCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar categorias' });
  }
};

exports.buscar = async (req, res) => {
  try {
    const categoria = await Categoria.buscarPorId(req.params.id);
    if (!categoria) return res.status(404).json({ mensagem: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar categoria' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    await Categoria.atualizarCategoria(req.params.id, req.body);
    res.json({ mensagem: 'Categoria atualizada com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar categoria' });
  }
};

exports.remover = async (req, res) => {
  try {
    await Categoria.removerCategoria(req.params.id);
    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover categoria' });
  }
};
