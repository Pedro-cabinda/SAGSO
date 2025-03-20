import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Snackbar, IconButton, Badge, Tooltip, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip as ChartTooltip, Legend, ArcElement, PointElement } from 'chart.js';
import { Assessment, PendingActions, TrendingDown, Close, Notifications, Delete, CheckCircle } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Registrando os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, ChartTooltip, Legend, ArcElement, PointElement);

const Dashboard = () => {
  const [alertasExames, setAlertasExames] = useState([
    { nome: 'João Silva', exame: 'Hemograma', vencimento: '20/03/2025' },
    { nome: 'Maria Oliveira', exame: 'Raio-X', vencimento: '22/03/2025' },
    { nome: 'Carlos Santos', exame: 'Eletrocardiograma', vencimento: '25/03/2025' },
  ]);
  const [notificacao, setNotificacao] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleExcluirNotificacao = (index) => {
    setAlertasExames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMarcarTodasComoLidas = () => {
    setAlertasExames([]);
  };

  const exportarPDF = async () => {
    const doc = new jsPDF();
    doc.text('Relatório de Saúde Ocupacional', 10, 10);
    
    const canvas = await html2canvas(document.querySelector('#graficos'));
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 20, 180, 100);
    doc.save('relatorio.pdf');
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2, mb: 2 }}>
        <Tooltip title="Alertas de Exames">
          <IconButton onClick={() => setDrawerOpen(true)}>
            <Badge badgeContent={alertasExames.length} color="error">
              <Notifications fontSize="large" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6">Notificações</Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {alertasExames.map((alerta, index) => (
              <ListItem key={index} secondaryAction={<IconButton onClick={() => handleExcluirNotificacao(index)}><Delete /></IconButton>}>
                <ListItemText primary={`${alerta.nome} - ${alerta.exame}`} secondary={`Vencimento: ${alerta.vencimento}`} />
              </ListItem>
            ))}
          </List>
          <Button startIcon={<CheckCircle />} variant="outlined" fullWidth onClick={handleMarcarTodasComoLidas}>Marcar todas como lidas</Button>
        </Box>
      </Drawer>

      <Grid container spacing={3} justifyContent="center">
        {[{ label: 'Atendimentos Mensais', value: '90', icon: <Assessment fontSize="large" />, color:'#FF6347' },
          { label: 'Exames Pendentes', value: '45', icon: <PendingActions fontSize="large" />, color:'#32CD32' },
          { label: 'Absenteísmo', value: '12%', color:'#FFD700', icon: <TrendingDown fontSize="large" /> }].map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ padding: 3, textAlign: 'center', background: '#fff', borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" sx={{ color: item.color }}>{item.icon} {item.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }} id="graficos">
        <Grid item xs={12} md={4}><Paper sx={{ padding: 2, boxShadow: 3 }}><Bar data={{ labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Atendimentos', data: [40, 55, 60, 70, 85, 90], backgroundColor: 'rgba(30, 144, 255, 0.7)' }, { label: 'Exames Pendentes', data: [20, 35, 45, 50, 60, 75], backgroundColor: 'rgba(255, 99, 71, 0.7)' }] }} /></Paper></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ padding: 2, boxShadow: 3 }}><Pie data={{ labels: ['Gripes', 'Dores Musculares', 'Hipertensão', 'Outros'], datasets: [{ data: [30, 25, 15, 30], backgroundColor: ['#FF6347', '#1E90FF', '#32CD32', '#FFD700'] }] }} /></Paper></Grid>
        <Grid item xs={12} md={4}><Paper sx={{ padding: 2, boxShadow: 3 }}><Line data={{ labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ label: 'Absenteísmo (%)', data: [10, 12, 8, 15, 13, 10], borderColor: '#FF6347', fill: false }] }} /></Paper></Grid>
      </Grid>

      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => { exportarPDF(); setNotificacao(true); }}>Exportar Relatório</Button>
      </Box>

      <Snackbar open={notificacao} autoHideDuration={3000} onClose={() => setNotificacao(false)} message="Relatório exportado!" action={<IconButton size="small" onClick={() => setNotificacao(false)}><Close fontSize="small" /></IconButton>} />
    </Container>
  );
};

export default Dashboard;
