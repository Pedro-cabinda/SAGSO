import React from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import './estoque.css'; // Arquivo CSS para os estilos personalizados

const Dashboard = () => {
  const stockData = {
    labels: ['Medicamento', 'Material Médico', 'Outros'],
    datasets: [
      {
        label: 'Quantidade em Estoque',
        data: [150, 200, 100],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
      },
    ],
  };

  const consumptionData = {
    labels: ['Janeiro', 'Fevereiro', 'Março'],
    datasets: [
      {
        label: 'Consumo Mensal',
        data: [120, 90, 150],
        backgroundColor: '#FF5722',
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Gestão de Estoque</h1>
      <div className="charts">
        <div className="chart">
          <h2 className="chart-title">Estoque Atual por Categoria</h2>
          <Pie data={stockData} options={{ maintainAspectRatio: true }} />
        </div>
        <div className="chart">
          <h2 className="chart-title">Consumo Mensal</h2>
          <Bar data={consumptionData} options={{ maintainAspectRatio: true }} />
        </div>
      </div>
      <div className="actions">
        <Link to="/Entradas" className="btn btn-primary">Adicionar Itens</Link>
        <Link to="/Saidas" className="btn btn-secondary">Registrar Saídas</Link>
        <Link to="/Relatorios" className="btn btn-tertiary">Gerar Relatórios</Link>
      </div>
    </div>
  );
};

export default Dashboard;
