// Arquivo App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './componentes/SideBar';
import Home from './paginas/Home';
import Atendimento from './paginas/Atendimento';
import Estoque from './paginas/Estoque';
import Agendamento from './paginas/Agendamento';

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/atendimentos" element={<Atendimento />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/agendamentos" element={<Agendamento />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
