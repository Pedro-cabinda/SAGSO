const Agendamento = require('../models/agendamentoModel');
const Paciente = require('../models/PacienteModel');
const enviarEmail = require('../Util/email');

/**
 * Calcula idade do paciente a partir da data de nascimento
 */
const calcularIdade = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

/**
 * Agendamento individual
 */
exports.agendar = async (req, res) => {
  try {
    const { paciente_id, profissional_id, data_agendada, hora, motivo,observacoes,exame,  instituicao, logoURL } = req.body;

    const id = await Agendamento.criar({
      paciente_id,
      profissional_id,
      data: data_agendada, // corrigido
      hora,
      motivo,
      exame,
      observacoes,
      status: Agendamento.STATUS.PENDENTE
    });

    const paciente = await Paciente.buscarPorId(paciente_id);

    // Envia email
    await enviarEmail(paciente.email, {
      nome: paciente.nome,
      data: data_agendada,
      hora,
      exame,
      profissional: req.user.id,
      instituicao,
      logoURL
    });

    res.json({ mensagem: 'Agendamento realizado', agendamento_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao agendar' });
  }
};

/**
 * Agendamento em massa
 */
exports.agendarEmMassa = async (req, res) => {
  try {
    const { data_agendada, hora, profissional_id, exame, observacoes, instituicao, logoURL } = req.body;
    const pacientes = await Paciente.listarPacientes();
    const agendados = [];

    for (const paciente of pacientes) {
      const idade = calcularIdade(paciente.data_nascimento);
      const ultimo = await Agendamento.buscarUltimoAgendamento(paciente.id);

      let precisaAgendar = false;
      if (!ultimo) {
        precisaAgendar = true;
      } else {
        const ultimoAno = new Date(ultimo.data).getFullYear();
        const atualAno = new Date().getFullYear();
        if ((idade >= 50 && atualAno > ultimoAno) || (idade < 50 && atualAno - ultimoAno >= 2)) {
          precisaAgendar = true;
        }
      }

      if (precisaAgendar) {
        const id = await Agendamento.criar({
          paciente_id: paciente.id,
          profissional_id,
          data: data_agendada,
          hora,
          motivo: 'Exame periódico',
          exame,
          observacoes,
          status: 'Agendado'
        });

        agendados.push(paciente.email);

        await enviarEmail(paciente.email, {
          nome: paciente.nome,
          data: data_agendada,
          hora,
          exame,
          profissional: profissional_id,
          instituicao,
          logoURL
        });
      }
    }

    res.json({ mensagem: 'Agendamentos em massa concluídos', total: agendados.length, emails: agendados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao agendar em massa' });
  }
};

/**
 * Listar todos os agendamentos
 */
exports.listarTodos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.listarTodos();
    res.json(agendamentos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar agendamentos' });
  }
};

/**
 * Listar agendamentos por status
 */
exports.listarPorStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const agendamentos = await Agendamento.listarPorStatus(status);
    res.json(agendamentos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao listar por status' });
  }
};

/**
 * Buscar agendamento por ID
 */
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const agendamento = await Agendamento.buscarPorId(id);
    if (!agendamento) {
      return res.status(404).json({ erro: 'Agendamento não encontrado' });
    }
    res.json(agendamento);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar agendamento' });
  }
};

/**
 * Atualizar dados do agendamento
 */
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    // pega o profissional do token (injetado no authMiddleware)
    const profissional= req.usuario.id;


    
    await Agendamento.atualizar({
      id,
      paciente_id:dados.paciente_id,
      profissional_id:profissional, // força sempre ser o logado
      data_agendada: dados.data,
      hora: dados.hora,
      motivo: dados.motivo,
      exame: dados.exame,
      observacoes: dados.observacoes,
      status: dados.status
    });

    res.json({ mensagem: 'Agendamento atualizado com sucesso!' });
  } catch (err) {
    console.error("Erro no atualizar:", err);
    res.status(500).json({ erro: 'Erro ao atualizar agendamento' });
  }
 

  
};

/**
 * Atualizar status do agendamento
 */
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Agendamento.atualizarStatus(id, status);
    res.json({ mensagem: `Status atualizado para ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
};

/**
 * Deletar (cancelar) agendamento
 */
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    await Agendamento.atualizarStatus(id, Agendamento.STATUS.CANCELADO);
    res.json({ mensagem: 'Agendamento cancelado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cancelar agendamento' });
  }
};
