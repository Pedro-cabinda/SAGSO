const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaController');
const autenticar = require('../middlewares/authMiddleware');

router.post('/', autenticar, controller.criar);
router.get('/', autenticar, controller.listar);
router.get('/:id', autenticar, controller.buscar);
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, controller.remover);

module.exports = router;
