const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacienteController');
const autenticar = require('../middlewares/authMiddleware');

router.use(autenticar); // proteger todas as rotas

// Rotas específicas primeiro
router.get('/funcionarios', controller.getFuncionarios);
router.get('/matricula/:numero', controller.buscarPorMatricula);
router.get('/:id', controller.buscarPorId);

// Rotas gerais
router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
