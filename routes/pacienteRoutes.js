const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacienteController');
const autenticar = require('../middlewares/authMiddleware');

router.use(autenticar); // proteger todas as rotas

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
