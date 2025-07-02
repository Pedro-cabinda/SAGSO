const express = require('express');
const router = express.Router();
const autenticar = require('../middlewares/authMiddleware');

router.get('/painel', autenticar, (req, res) => {
  res.json({ mensagem: `Bem-vindo ao painel, ${req.usuario.tipo}` });
});

module.exports = router;
