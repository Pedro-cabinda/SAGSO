const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.get('/auth/profissionais', authController.listarProfissionais);


module.exports = router;
