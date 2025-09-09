const express = require('express');
const router = express.Router();
const controller = require('../controllers/agendamentoController');
const autenticar = require('../middlewares/authMiddleware');
const Agendamento = require('../models/agendamentoModel');

// ================== Agendamentos ==================

// Agendamento em massa
router.post('/massa', autenticar, controller.agendarEmMassa);

// Listar todos os agendamentos
router.get('/', autenticar, controller.listarTodos);

// Listar agendamentos pendentes
router.get('/pendentes', autenticar, async (req, res) => {
  try {
    const agendamentos = await controller.listarPorStatus({ params: { status: Agendamento.STATUS.PENDENTE } }, res);
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar agendamentos pendentes' });
  }
});

// Listar agendamentos por status (dinâmico)
router.get('/status/:status', autenticar, controller.listarPorStatus);

// Buscar agendamento por ID
router.get('/:id', autenticar, controller.buscarPorId);

// Atualizar status do agendamento
router.patch('/:id/status', autenticar, controller.atualizarStatus);

// Atualizar dados do agendamento
router.put('/:id', autenticar, controller.atualizar);

// Deletar agendamento
router.delete('/:id', autenticar, controller.deletar);

module.exports = router;
