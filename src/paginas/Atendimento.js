import React, { useState, useEffect } from 'react';
import { FaChartBar, FaMedkit, FaHeartbeat, FaUserMd } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../paginas/atendimento.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Atendimentos = () => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [filtroData, setFiltroData] = useState('');
  const [filtroProfissional, setFiltroProfissional] = useState('');
  const [filtroDiagnostico, setFiltroDiagnostico] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [novoAtendimento, setNovoAtendimento] = useState({
    paciente: '',
    dataHora: '',
    sintomas: '',
    diagnostico: '',
    medicamentos: '',
    profissional: ''
  });

  useEffect(() => {
    const dadosAtendimentos = [
      { id: 1, paciente: 'João Costa', dataHora: '2025-02-01 08:30', sintomas: 'Dor de cabeça, náuseas', diagnostico: 'Hipertensão', medicamentos: 'Losartana 50mg', profissional: 'Dr. Carlos Pereira' },
      { id: 2, paciente: 'Emanuel Tunga', dataHora: '2025-02-02 09:15', sintomas: 'Fratura no braço', diagnostico: 'Fratura óssea', medicamentos: 'Analgesico, Gesso', profissional: 'Dra. Ana Souza' },
      { id: 3, paciente: 'Pedro Cabinda', dataHora: '2025-02-03 14:00', sintomas: 'Resfriado, febre', diagnostico: 'Resfriado comum', medicamentos: 'Paracetamol 500mg', profissional: 'Dr. João Almeida' },
    ];
    setAtendimentos(dadosAtendimentos);
  }, []);

  const filtrarAtendimentos = () => {
    return atendimentos.filter((atendimento) => {
      const dataValida = filtroData ? atendimento.dataHora.includes(filtroData) : true;
      const profissionalValido = filtroProfissional ? atendimento.profissional.toLowerCase().includes(filtroProfissional.toLowerCase()) : true;
      const diagnosticoValido = filtroDiagnostico ? atendimento.diagnostico.toLowerCase().includes(filtroDiagnostico.toLowerCase()) : true;

      return dataValida && profissionalValido && diagnosticoValido;
    });
  };

  const contarAtendimentosPorPeriodo = () => {
    return filtrarAtendimentos().length;
  };

  const contarSintomasMaisComuns = () => {
    const sintomas = filtrarAtendimentos().map((atendimento) => atendimento.sintomas);
    const contagemSintomas = {};
    sintomas.forEach((sintoma) => {
      contagemSintomas[sintoma] = contagemSintomas[sintoma] ? contagemSintomas[sintoma] + 1 : 1;
    });
    return contagemSintomas;
  };

  const contarMedicamentosMaisUsados = () => {
    const medicamentos = filtrarAtendimentos().map((atendimento) => atendimento.medicamentos);
    const contagemMedicamentos = {};
    medicamentos.forEach((medicamento) => {
      contagemMedicamentos[medicamento] = contagemMedicamentos[medicamento] ? contagemMedicamentos[medicamento] + 1 : 1;
    });
    return contagemMedicamentos;
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const novoId = atendimentos.length + 1;
    const atendimento = { ...novoAtendimento, id: novoId };
    setAtendimentos([...atendimentos, atendimento]);
    setIsFormVisible(false);
  };

  // Configuração dos gráficos
  const sintomasChartData = {
    labels: Object.keys(contarSintomasMaisComuns()),
    datasets: [
      {
        label: 'Sintomas',
        data: Object.values(contarSintomasMaisComuns()),
        backgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const medicamentosChartData = {
    labels: Object.keys(contarMedicamentosMaisUsados()),
    datasets: [
      {
        label: 'Medicamentos',
        data: Object.values(contarMedicamentosMaisUsados()),
        backgroundColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  // Opções de configuração dos gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite o gráfico ajustar a altura e largura
    scales: {
      x: {
        ticks: {
          font: { size: 10 }, // Tamanho da fonte dos ticks no eixo X
        },
      },
      y: {
        ticks: {
          font: { size: 10 }, // Tamanho da fonte dos ticks no eixo Y
        },
      },
    },
  };

  return (
    <div className="atendimentos">
      <h1 className="atendimentos-title">Gestão de Atendimentos</h1>

      {/* Filtros */}
      <div className="filtros">
        <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} placeholder="Filtrar por data" />
        <input type="text" value={filtroProfissional} onChange={(e) => setFiltroProfissional(e.target.value)} placeholder="Filtrar por profissional" />
        <input type="text" value={filtroDiagnostico} onChange={(e) => setFiltroDiagnostico(e.target.value)} placeholder="Filtrar por diagnóstico" />
      </div>

      {/* Modal de Formulário */}
      {isFormVisible && (
        <div className="modal-overlay">
          <div className="form-container">
            <h2 className="form-title">Cadastrar Atendimento</h2>
            <form onSubmit={handleFormSubmit}>
              <input type="text" value={novoAtendimento.paciente} onChange={(e) => setNovoAtendimento({ ...novoAtendimento, paciente: e.target.value })} placeholder="Nome do paciente" required />
              <input type="datetime-local" value={novoAtendimento.dataHora} onChange={(e) => setNovoAtendimento({ ...novoAtendimento, dataHora: e.target.value })} required />
              <textarea value={novoAtendimento.sintomas} onChange={(e) => setNovoAtendimento({ ...novoAtendimento, sintomas: e.target.value })} placeholder="Sintomas" required />
              <input type="text" value={novoAtendimento.diagnostico} onChange={(e) => setNovoAtendimento({ ...novoAtendimento, diagnostico: e.target.value })} placeholder="Diagnóstico" required />
              <input type="text" value={novoAtendimento.medicamentos} onChange={(e) => setNovoAtendimento({ ...novoAtendimento, medicamentos: e.target.value })} placeholder="Medicamentos/Procedimentos" required />
              <input type="text" value={novoAtendimento.profissional} onChange={(e) => setNovoAtendimento({ ...novoAtendimento, profissional: e.target.value })} placeholder="Profissional" required />
              <div className="buttons">
                <button type="button" className="btn-close" onClick={toggleFormVisibility}>Fechar</button>
                <button type="submit" className="btn-success">Cadastrar Atendimento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de Atendimentos */}
      <div className={`atendimentos-list ${isFormVisible ? 'faded' : ''}`}>
        <h2 className="list-title">Histórico de Atendimentos</h2>
        <table className="atendimentos-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Data e Hora</th>
              <th>Sintomas</th>
              <th>Diagnóstico</th>
              <th>Medicamentos</th>
              <th>Profissional</th>
            </tr>
          </thead>
          <tbody>
            {filtrarAtendimentos().map((atendimento) => (
              <tr key={atendimento.id}>
                <td>{atendimento.paciente}</td>
                <td>{atendimento.dataHora}</td>
                <td>{atendimento.sintomas}</td>
                <td>{atendimento.diagnostico}</td>
                <td>{atendimento.medicamentos}</td>
                <td>{atendimento.profissional}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Botões abaixo da tabela */}
        <div className="buttons">
          <button className="btn-success">Gerar Relatório</button>
          <button className="btn-primary" onClick={toggleFormVisibility}>Cadastrar Atendimento</button>
        </div>
      </div>

      {/* Relatórios e Estatísticas */}
      <div className="relatorios">
        <h2>Relatórios e Estatísticas</h2>
        <div className="relatorio-cards">
          <div className="relatorio-card">
            <FaChartBar size={50} />
            <p><strong>Quantidade de Atendimentos:</strong> {contarAtendimentosPorPeriodo()}</p>
          </div>

          <div className="relatorio-card">
            <FaHeartbeat size={80} />
            <h3>Sintomas Mais Comuns</h3>
            <div style={{ height: '250px', width: '60%' }}>
              <Bar data={sintomasChartData} options={chartOptions} />
            </div>
          </div>

          <div className="relatorio-card">
            <FaMedkit size={80} />
            <h3>Medicamentos Mais Usados</h3>
            <div style={{ height: '250px', width: '60%' }}>
              <Bar data={medicamentosChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Atendimentos;
