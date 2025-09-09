const express = require('express');
const router = express.Router();
const CursoDepartamentoController = require('../controllers/cursoDepartamentoController');

router.get('/cursos-departamentos', CursoDepartamentoController.listar);

module.exports = router;
