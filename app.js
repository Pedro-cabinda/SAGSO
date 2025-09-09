const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const authRoutes = require('./routes/authRoutes');
app.use('/api/', authRoutes);




const pacienteRoutes = require('./routes/pacienteRoutes');
app.use('/api/pacientes', pacienteRoutes);

const atendimentoRoutes = require('./routes/atendimentoRoutes');
app.use('/api/atendimentos', atendimentoRoutes);

const entradaEstoqueRoutes = require('./routes/entradaEstoqueRoutes');
app.use('/api/entrada-estoque', entradaEstoqueRoutes);

const saidaRoutes = require('./routes/saidaEstoqueRoutes');
app.use('/api/saidas', saidaRoutes);

const produtoRoutes = require('./routes/produtoRoutes');
app.use('/api/produtos', produtoRoutes);

const categoriaRoutes = require('./routes/categoriaRoutes');
app.use('/api/categorias', categoriaRoutes);

const estoqueRoutes = require('./routes/estoqueRoutes');
app.use('/api/estoque', estoqueRoutes);
const agendamentoRoutes = require('./routes/agendamentoRoutes');
app.use('/api/agendamentos', agendamentoRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);


const cursoDepartamentoRoutes = require('./routes/cursoDepartamentoRoutes');

app.use('/api', cursoDepartamentoRoutes);





module.exports = app;
