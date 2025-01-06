import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  // Dados fictícios para os gráficos de barras e pizza
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Atendimentos',
        data: [40, 55, 60, 70, 85, 90],
        backgroundColor: 'rgba(30, 144, 255, 0.7)', // Azul mais suave
        borderColor: '#1E90FF',
        borderWidth: 2,
        hoverBackgroundColor: '#1E90FF', // Cor ao passar o mouse
        hoverBorderColor: '#000000',
      },
      {
        label: 'Estoque',
        data: [20, 40, 50, 80, 100, 120],
        backgroundColor: 'rgba(255, 99, 71, 0.7)', // Tom mais suave de vermelho
        borderColor: '#FF6347',
        borderWidth: 2,
        hoverBackgroundColor: '#FF6347',
        hoverBorderColor: '#000000',
      },
    ],
  };

  const pieData = {
    labels: ['Atendimentos', 'Estoque', 'Outros'],
    datasets: [
      {
        label: 'Distribuição',
        data: [60, 30, 10], // Exemplo de distribuição
        backgroundColor: ['#FF6347', '#1E90FF', '#FFD700'], // Cores mais harmônicas
        borderColor: ['#FF6347', '#1E90FF', '#FFD700'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      {/* Box para centralizar o título */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '70px' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            background: 'linear-gradient(45deg, #1E90FF, #FF6347)',
            padding: '10px 30px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            letterSpacing: '1px',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'uppercase',
            fontSize: '36px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Sombra suave no texto
          }}
        >
          Bem-vindo à Plataforma SAGSO
        </Typography>
      </Box>

      {/* Container flexível para os gráficos lado a lado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        
        {/* Gráfico de Barras */}
        <Box sx={{ width: '48%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Gráfico de Atendimentos e Estoque (Barras)
          </Typography>
          <Bar
            data={barData}
            options={{
              responsive: true,
              animations: {
                tension: {
                  duration: 1000,
                  easing: 'easeOutBounce',
                  from: 1,
                  to: 0,
                  loop: true,
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Atendimentos e Estoque ao longo dos meses',
                  font: { size: 20, weight: 'bold' },
                  color: '#333',
                },
                tooltip: {
                  enabled: true,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  footerColor: '#fff',
                  bodyFont: { size: 14 },
                  footerFont: { size: 12 },
                  padding: 10,
                  callbacks: {
                    label: (tooltipItem) => {
                      return `${tooltipItem.dataset.label}: ${tooltipItem.raw} unidades`;
                    },
                  },
                },
                legend: {
                  position: 'top',
                  labels: {
                    font: { size: 14, weight: 'bold' },
                    color: '#333',
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Meses',
                    font: { size: 16 },
                    color: '#333',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Quantidade',
                    font: { size: 16 },
                    color: '#333',
                  },
                  beginAtZero: true,
                  ticks: {
                    stepSize: 20,
                    max: 140,
                  },
                },
              },
            }}
          />
        </Box>

        {/* Gráfico de Pizza */}
        <Box sx={{ width: '48%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Distribuição de Atendimentos, Estoque e Outros
          </Typography>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: 'Distribuição geral entre as categorias',
                  font: { size: 20, weight: 'bold' },
                  color: '#333',
                },
                tooltip: {
                  enabled: true,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  titleColor: '#fff',
                  bodyColor: '#fff',
                  footerColor: '#fff',
                  bodyFont: { size: 14 },
                  footerFont: { size: 12 },
                  padding: 10,
                  callbacks: {
                    label: (tooltipItem) => {
                      return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                    },
                  },
                },
                legend: {
                  position: 'bottom',
                  labels: {
                    font: { size: 14, weight: 'bold' },
                    color: '#333',
                  },
                },
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
