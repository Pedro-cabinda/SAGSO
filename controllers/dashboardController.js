const dashboardModel = require('../models/dashboardModel');

exports.obterEstatisticas = async (req, res) => {
  try {
    const atendimentosMensais = await dashboardModel.obterAtendimentosMensais();
    const examesPorMes = await dashboardModel.obterExamesPorMes();
    const distribuicaoExames = await dashboardModel.obterDistribuicaoPorTipoExame();
    const examesPendentes = await dashboardModel.obterExamesPendentesPorMes();
    const absenteismo = await dashboardModel.obterAbsenteismo();
    const { totalAtendimentos, totalExames } = await dashboardModel.obterTotais();

    res.json({
      atendimentosMensais,
      examesPorMes,
      distribuicaoExames,
      examesPendentes,
      absenteismo,
      totalAtendimentos,
      totalExames
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ erro: 'Erro ao buscar dados do dashboard' });
  }
};
