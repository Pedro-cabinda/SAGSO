const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

exports.registrar = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) return res.status(400).json({ mensagem: 'Usuário já existe' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const id = await Usuario.criarUsuario({ nome, email, senha: senhaHash, tipo });

    res.status(201).json({ id, nome, email, tipo });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha inválida' });

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo } });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login' });
  }
};
