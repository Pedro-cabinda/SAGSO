const express = require('express');
const router = express.Router();
const controller = require('../controllers/atendimentoController');
const autenticar = require('../middlewares/authMiddleware');

router.use(autenticar); // protege todas as rotas com JWT

// ✅ Nova rota para filtrar atendimentos
router.post('/filtrar', controller.filtrarAtendimentos);

// Rotas CRUD
router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/historico/:numeroMatricula', controller.buscarHistorico);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
