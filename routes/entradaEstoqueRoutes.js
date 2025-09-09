const express = require('express');
const router = express.Router();
const controller = require('../controllers/entradaEstoqueController');
const autenticar = require('../middlewares/authMiddleware');

router.use(autenticar);
router.post('/', controller.criar);
router.get('/', controller.listar);
router.put('/:id', controller.atualizar);
router.get('/relatorio-mensal', controller.relatorioMensal);

module.exports = router;
