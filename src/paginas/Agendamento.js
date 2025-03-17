import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

// Lista de funcionários pré-cadastrados
const funcionarios = [
  { id: 1, nome: "João Silva" },
  { id: 2, nome: "Maria Oliveira" },
  { id: 3, nome: "Carlos Santos" },
];

const exames = ["Hemograma", "Raio-X", "Eletrocardiograma", "Audiometria"];

const Agendamento = () => {
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState([]);
  const [exameSelecionado, setExameSelecionado] = useState("");
  const [dataExame, setDataExame] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [notificacao, setNotificacao] = useState({ open: false, message: "", type: "success" });

  // Agendar exame para múltiplos funcionários
  const handleAgendar = () => {
    if (funcionariosSelecionados.length > 0 && exameSelecionado && dataExame) {
      const novosAgendamentos = funcionariosSelecionados.map((funcionario) => ({
        id: Math.random(),
        funcionario,
        exame: exameSelecionado,
        data: dataExame,
      }));

      setAgendamentos([...agendamentos, ...novosAgendamentos]);

      setNotificacao({ open: true, message: "Exames agendados com sucesso!", type: "success" });

      // Resetando campos
      setFuncionariosSelecionados([]);
      setExameSelecionado("");
      setDataExame("");
    } else {
      setNotificacao({ open: true, message: "Preencha todos os campos!", type: "error" });
    }
  };

  return (
    <Container>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(45deg, #1E90FF, #FF6347)",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          Agendamento de Exames - Clínica Girassol
        </Typography>
      </Box>

      {/* Formulário de Agendamento */}
      <Paper sx={{ padding: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Funcionários</InputLabel>
              <Select
                multiple
                value={funcionariosSelecionados}
                onChange={(e) => setFuncionariosSelecionados(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
              >
                {funcionarios.map((func) => (
                  <MenuItem key={func.id} value={func.nome}>
                    {func.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Exame</InputLabel>
              <Select
                value={exameSelecionado}
                onChange={(e) => setExameSelecionado(e.target.value)}
              >
                {exames.map((exame, index) => (
                  <MenuItem key={index} value={exame}>
                    {exame}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="Data do Exame"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dataExame}
              onChange={(e) => setDataExame(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleAgendar}>
            Agendar Exames
          </Button>
        </Box>
      </Paper>

      {/* Lista de Exames Agendados */}
      <Typography variant="h6">Exames Agendados</Typography>
      {agendamentos.length === 0 && <Typography>Nenhum exame agendado.</Typography>}
      {agendamentos.map((item) => (
        <Paper key={item.id} sx={{ padding: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
          <Typography>
            <strong>Funcionário:</strong> {item.funcionario}
          </Typography>
          <Typography>
            <strong>Exame:</strong> {item.exame}
          </Typography>
          <Typography>
            <strong>Data:</strong> {item.data}
          </Typography>
          <Typography color="green"><strong>Notificação enviada!</strong></Typography>
        </Paper>
      ))}

      {/* Notificação (Snackbar) */}
      <Snackbar open={notificacao.open} autoHideDuration={3000} onClose={() => setNotificacao({ ...notificacao, open: false })}>
        <Alert onClose={() => setNotificacao({ ...notificacao, open: false })} severity={notificacao.type} sx={{ width: "100%" }}>
          {notificacao.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Agendamento;
