const express = require('express');
const router = express.Router();
const controller = require('../controllers/saidaEstoqueController');
const autenticar = require('../middlewares/authMiddleware');

router.use(autenticar);
router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/relatorio-mensal', controller.relatorioMensal);

module.exports = router;