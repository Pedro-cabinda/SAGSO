import React from 'react';
import { Container, Typography, Box, Grid, Paper,  Button } from '@mui/material';
import { Bar, Pie,  } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Dados fictícios para os gráficos
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Atendimentos',
        data: [40, 55, 60, 70, 85, 90],
        backgroundColor: 'rgba(30, 144, 255, 0.7)',
      },
      {
        label: 'Exames Pendentes',
        data: [20, 35, 45, 50, 60, 75],
        backgroundColor: 'rgba(255, 99, 71, 0.7)',
      },
    ],
  };

  const pieData = {
    labels: ['Gripes', 'Dores Musculares', 'Hipertensão', 'Outros'],
    datasets: [
      {
        data: [30, 25, 15, 30],
        backgroundColor: ['#FF6347', '#1E90FF', '#32CD32', '#FFD700'],
      },
    ],
  };

  const alertasExames = [
    { nome: 'João Silva', exame: 'Hemograma', vencimento: '20/03/2025' },
    { nome: 'Maria Oliveira', exame: 'Raio-X', vencimento: '22/03/2025' },
  ];


  return (
    <Container>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard de Saúde Ocupacional
        </Typography>
      </Box>

      {/* Indicadores Rápidos */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, textAlign: 'center', background: '#1E90FF', color: '#fff' }}>
            <Typography variant="h6">Atendimentos Mensais</Typography>
            <Typography variant="h4">90</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, textAlign: 'center', background: '#FF6347', color: '#fff' }}>
            <Typography variant="h6">Exames Pendentes</Typography>
            <Typography variant="h4">45</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 2, textAlign: 'center', background: '#32CD32', color: '#fff' }}>
            <Typography variant="h6">Absenteísmo</Typography>
            <Typography variant="h4">12%</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Bar data={barData} options={{ responsive: true }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Pie data={pieData} options={{ responsive: true }} />
          </Paper>
        </Grid>
      </Grid>

     
      <Box sx={{ marginTop: '40px' }}>
        <Typography variant="h6" gutterBottom>Alertas de Exames Vencendo</Typography>
        {alertasExames.map((alerta, index) => (
          <Paper key={index} sx={{ padding: '10px', marginBottom: '10px', backgroundColor: '#FFD700' }}>
            <Typography>{`${alerta.nome} tem exame de ${alerta.exame} vencendo em ${alerta.vencimento}`}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Botão de Exportação */}
      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Button variant="contained" color="primary">
          Exportar Relatório
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
