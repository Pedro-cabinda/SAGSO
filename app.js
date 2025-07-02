const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Saúde Ocupacional Online'));

const protegidoRoutes = require('./routes/protegido');
app.use('/api', protegidoRoutes);

const pacienteRoutes = require('./routes/pacienteRoutes');
app.use('/api/pacientes', pacienteRoutes);



module.exports = app;
