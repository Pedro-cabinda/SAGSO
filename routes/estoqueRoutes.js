// src/routes/estoqueRoutes.js
const express = require('express');
const router = express.Router();
const EstoqueController  = require('../controllers/estoqueController');
const autenticar = require('../middlewares/authMiddleware');



router.use(autenticar); // proteger todas as rotas
// Listar todas as movimentações
router.get('/', EstoqueController.listarMovimentacoes);

// Filtrar por produto (via parâmetro de rota)
router.get('/produto/:produtoId', EstoqueController.filtrarPorProduto);

// Filtrar por data (via query string: ?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD)
router.get('/data', EstoqueController.filtrarPorData);

// Listar por tipo (entrada ou saida)
router.get('/tipo/:tipo', EstoqueController.listarPorTipo);

// Alerta de estoque baixo
router.get('/alerta/baixo', EstoqueController.alertaEstoqueBaixo);

// Histórico detalhado
router.get('/detalhes', EstoqueController.listarComDetalhes);

module.exports = router;
