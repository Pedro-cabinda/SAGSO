import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Snackbar,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';



const MotionPaper = motion(Paper);
const MotionAvatar = motion(Avatar);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

const Login = () => {
  const [tab, setTab] = useState(0);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [confSenha, setConfSenha] = useState('');
  const [notificacao, setNotificacao] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mensagemNotificacao, setMensagemNotificacao] = useState('');
  const navigate = useNavigate(); // Aqui é onde o navigate é definido


  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === '' || senha === '') {
      setMensagemNotificacao('Preencha todos os campos!');
      setNotificacao(true);
    } else {
      setLoading(true);
      setTimeout(() => {
        if (usuario === 'admin' && senha === '1234') {
          localStorage.setItem('token', 'usuarioAutenticado'); // ← ADICIONAR ESTA LINHA
          navigate('/home'); // ← troque para apenas /
        }
         else {
          setMensagemNotificacao('Usuário ou senha inválidos!');
          setNotificacao(true);
        }
        setLoading(false);
      }, 2000);
    }
  };
  
  

  const handleRegister = (e) => {
    e.preventDefault();
    if (nome === '' || usuario === '' || senha === '' || confSenha === '') {
      setNotificacao(true);
    } else if (senha !== confSenha) {
      alert('As senhas não coincidem');
    } else {
      setLoading(true);
      setTimeout(() => {
        console.log('Registrado:', { nome, usuario, senha });
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url('/imagens/fundo.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        backdropFilter: 'blur(3px)',
      }}
    >
      <Container maxWidth="xs">
        <MotionPaper
          elevation={10}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          sx={{
            p: 4,
            borderRadius: 6,
            textAlign: 'center',
            backgroundColor: darkMode ? '#1e1e1e' : 'rgba(255,255,255,0.92)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
    
          <MotionAvatar
            sx={{ m: '0 auto', bgcolor: 'primary.main', width: 56, height: 56 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          >
            <LockOutlinedIcon fontSize="medium" />
          </MotionAvatar>

          <MotionTypography
            variant="h5"
            fontWeight="bold"
            color="primary"
            mt={2}
            mb={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {tab === 0 ? 'Login SAGSO' : 'Cadastro'}
          </MotionTypography>

          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            centered={!isMobile}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ mb: 3 }}
          >
            <Tab label="Login" />
            <Tab label="Cadastro" />
          </Tabs>

          <Box component="form" onSubmit={tab === 0 ? handleLogin : handleRegister}>
            {tab === 1 && (
              <TextField
                fullWidth
                margin="normal"
                label="Nome Completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Usuário"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {tab === 1 && (
              <TextField
                fullWidth
                margin="normal"
                label="Confirmar Senha"
                type="password"
                value={confSenha}
                onChange={(e) => setConfSenha(e.target.value)}
              />
            )}
            <MotionButton
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                height: 45,
                fontWeight: 'bold',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : tab === 0 ? 'Entrar' : 'Cadastrar'}
            </MotionButton>
          </Box>
        </MotionPaper>

        <Snackbar
      open={notificacao}
       autoHideDuration={3000}
        onClose={() => setNotificacao(false)}
        message={mensagemNotificacao}
          action={
          <IconButton size="small" onClick={() => setNotificacao(false)}>
         <CloseIcon fontSize="small" />
      </IconButton>
     }
      />

      </Container>
    </Box>
  );
};

export default Login;
