const Produto = require('../models/produtoModel');

exports.criar = async (req, res) => {
  try {
    const id = await Produto.criarProduto(req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ erro: 'Erro ao criar produto' });
  }
};

exports.listar = async (req, res) => {
  try {
    const produtos = await Produto.listarProdutos();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

exports.buscar = async (req, res) => {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ mensagem: 'Produto   não encontrado' });
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    // Verificar se o produto existe
    const produtoExistente = await Produto.buscarPorId(id);
    if (!produtoExistente) {
      return res.status(404).json({ mensagem: "   Produto não encontrado" });
    }

    // Atualizar no banco
    await Produto.atualizarProduto(id, dados);

    res.json({ mensagem: "Produto atualizado com sucesso" });
  } catch (err) {
    console.error("Erro ao atualizar produto:", err); // 👈 loga no terminal
    res.status(500).json({ erro: err.message || "Erro ao atualizar produto" });
  }
};


exports.remover = async (req, res) => {
  try {
    await Produto.removerProduto(req.params.id);
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover produto' });
  }
};


exports.graficoProdutosMaisUsados = async (req, res) => {
  try {
    const dados = await Produto.produtosMaisUsados();

    // Formatar para { "Dipirona": 10, "Paracetamol": 7, ... }
    const resultado = {};
    dados.forEach(({ produto, total_usado }) => {
      resultado[produto] = total_usado;
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao buscar produtos mais usados:', error);
    res.status(500).json({ mensagem: 'Erro interno ao gerar gráfico.' });
  }
};
