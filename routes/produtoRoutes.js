const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const autenticar = require('../middlewares/authMiddleware');

// Todas as rotas protegidas
router.post('/', autenticar, controller.criar);
router.get('/', autenticar, controller.listar);
router.get('/mais-usados', autenticar, controller.graficoProdutosMaisUsados);
router.get('/:id', autenticar, controller.buscar);
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, controller.remover);

module.exports = router;
