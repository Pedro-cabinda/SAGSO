
const db = require('../config/db');
const Atendimento = require('../models/atendimentoModel');
exports.criar = async (req, res) => {
  try {
    const {
      paciente_id,
      profissional_id,
      sintomas,
      diagnostico,
      medicamentos = [],
      destino,
      observacoes
    } = req.body;

    if (!paciente_id || !profissional_id) {
      return res.status(400).json({ error: 'Paciente e profissional são obrigatórios.' });
    }

    const produtosValidados = Array.isArray(medicamentos)
      ? medicamentos.map(p => ({
          produto_id: p.produto_id ?? null,
          quantidade: p.quantidade ?? 0
        }))
      : [];

    const dadosAtendimento = {
      paciente_id,
      profissional_id,
      dataHora: new Date(),
      sintomas: sintomas ?? null,
      diagnostico: diagnostico ?? null,
      prescricao: medicamentos ?? null,
      encaminhamento: destino ?? null,
      produtos_utilizados: produtosValidados
    };

    const resultado = await Atendimento.criar(dadosAtendimento);

    if (resultado.erro) {
      return res.status(400).json({ error: resultado.mensagem });
    }

    res.status(201).json({ mensagem: resultado.mensagem, id: resultado.atendimentoId });

  } catch (err) {
    console.error('Erro ao criar atendimento:', err);
    res.status(500).json({ error: 'Erro ao criar atendimento. Tente novamente.' });
  }
};




exports.listar = async (_req, res) => {
  try {
    const atendimentos = await Atendimento.listar(); // Já com JOIN no model
    res.json(atendimentos);
  } catch (err) {
    console.error('Erro ao listar atendimentos:', err);
    res.status(500).json({ erro: 'Erro ao listar atendimentos' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const atendimento = await Atendimento.buscarPorId(req.params.id);
    if (!atendimento) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json(atendimento);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar atendimento' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const {
      paciente_id,
      profissional_id,
      sintomas,
      diagnostico,
      medicamentos = [],
      destino,
      observacoes
    } = req.body;

    if (!paciente_id || !profissional_id) {
      return res.status(400).json({ error: 'Paciente e profissional são obrigatórios.' });
    }

    // Validação e estruturação dos medicamentos
    const produtosValidados = Array.isArray(medicamentos)
      ? medicamentos.map(p => ({
          produto_id: p.produto_id ?? null,
          quantidade: p.quantidade ?? 0
        }))
      : [];

    const dadosAtualizados = {
      paciente_id,
      profissional_id,
      sintomas: sintomas ?? null,
      diagnostico: diagnostico ?? null,
      prescricao: medicamentos ?? null,
      encaminhamento: destino ?? null,
      observacoes: observacoes ?? null,
      produtos_utilizados: produtosValidados
    };

    const alterado = await Atendimento.atualizar(req.params.id, dadosAtualizados);

    if (!alterado) {
      return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    }

    res.json({ mensagem: 'Atendimento atualizado com sucesso' });

  } catch (err) {
    console.error('Erro ao atualizar atendimento:', err);
    res.status(500).json({ erro: 'Erro ao atualizar atendimento' });
  }
};


exports.excluir = async (req, res) => {
  try {
    const excluido = await Atendimento.excluir(req.params.id);
    if (!excluido) return res.status(404).json({ mensagem: 'Atendimento não encontrado' });
    res.json({ mensagem: 'Atendimento excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir atendimento' });
  }
};


exports.buscarHistorico = async (req, res) => {
  try {
    const numeroMatricula = req.params.numeroMatricula;

    if (!numeroMatricula) {
      return res.status(400).json({ erro: 'Número de matrícula é obrigatório' });
    }

    const historico = await Atendimento.buscarHistoricoPorNumeroMatricula(numeroMatricula);

    // Sempre retorna 200, mesmo sem histórico
    if (!historico || historico.length === 0) {
      return res.json([]);
    }

    res.json(historico);
  } catch (err) {
    console.error('Erro ao buscar histórico do paciente:', err);
    res.status(500).json({ erro: 'Erro ao buscar histórico do paciente' });
  }
};


exports.filtrarAtendimentos = async (req, res) => {
  try {
    const { data, nome, profissional } = req.body;
    const atendimentos = await Atendimento.filtrarAtendimentos(data, nome, profissional);
    res.status(200).json(atendimentos);
  } catch (err) {
    console.error('Erro ao filtrar atendimentos:', err);
    res.status(500).json({ erro: 'Erro ao filtrar atendimentos' });
  }
};
