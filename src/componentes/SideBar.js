import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EventNoteIcon from '@mui/icons-material/EventNote';
import InventoryIcon from '@mui/icons-material/Inventory';
import HealingIcon from '@mui/icons-material/Healing';
import DescriptionIcon from '@mui/icons-material/Description'; // Ícone para Relatórios

const drawerWidth = 250;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'linear-gradient(180deg, #ffffff, #f9f9f9)', // Gradiente suave
          color: '#333',
          borderRadius: '20px', // Bordas mais arredondadas para um visual mais fluido
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)', // Sombra suave e elegante
          padding: '40px 0',
        },
      }}
    >
      {/* Parte superior (Logo) */}
      <Box
        sx={{
          bgcolor: 'white',
          padding: '10px 0', // Espaço mais generoso ao redor do logo
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '20px 20px 0 0', // Bordas arredondadas no topo
          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.05)', // Sombra leve
          flexDirection: 'column',
        }}
      >
        <img
          src="/imagens/logoIsptec.jpg"
          alt="Logo do Sistema de Gestão de Saúde e Operações"
          style={{
            width: '20%', // Ajuste do logo
            maxWidth: '120px',
            borderRadius: '12px', // Bordas arredondadas no logo
            objectFit: 'contain',
          }}
        />
        <Box
          sx={{
            marginTop: '12px',
            fontSize: '20px',
            color: '#333',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px', // Espaçamento para dar um toque sofisticado
          }}
        >
          SAGSO
        </Box>
      </Box>

      {/* Menu de navegação */}
      <List sx={{ paddingTop: '20px' }}>
        {/* Home */}
        <ListItem
          button
          component={Link}
          to="/"
          sx={{
            '&:hover': {
              bgcolor: '#FFD700', // Cor suave para hover
              borderRadius: '12px',
            },
            padding: '14px 24px',
            marginBottom: '12px',
            borderRadius: '12px',
            backgroundColor: '#F9F9F9',
            transition: 'background-color 0.3s ease', // Transição suave ao passar o mouse
          }}
        >
          <ListItemIcon sx={{ color: '#333', minWidth: '40px' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ fontSize: '18px', color: '#333' }} />
        </ListItem>

        {/* Atendimentos */}
        <ListItem
          button
          component={Link}
          to="/atendimentos"
          sx={{
            '&:hover': {
              bgcolor: '#FFD700',
              borderRadius: '12px',
            },
            padding: '14px 24px',
            marginBottom: '12px',
            borderRadius: '12px',
            backgroundColor: '#F9F9F9',
            transition: 'background-color 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: '#333', minWidth: '40px' }}>
            <HealingIcon />
          </ListItemIcon>
          <ListItemText primary="Atendimentos" sx={{ fontSize: '18px', color: '#333' }} />
        </ListItem>

        {/* Estoque */}
        <ListItem
          button
          component={Link}
          to="/estoque"
          sx={{
            '&:hover': {
              bgcolor: '#FFD700',
              borderRadius: '12px',
            },
            padding: '14px 24px',
            marginBottom: '12px',
            borderRadius: '12px',
            backgroundColor: '#F9F9F9',
            transition: 'background-color 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: '#333', minWidth: '40px' }}>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Estoque" sx={{ fontSize: '18px', color: '#333' }} />
        </ListItem>

        {/* Agendamento */}
        <ListItem
          button
          component={Link}
          to="/agendamento"
          sx={{
            '&:hover': {
              bgcolor: '#FFD700',
              borderRadius: '12px',
            },
            padding: '14px 24px',
            marginBottom: '12px',
            borderRadius: '12px',
            backgroundColor: '#F9F9F9',
            transition: 'background-color 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: '#333', minWidth: '40px' }}>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Agendamento" sx={{ fontSize: '18px', color: '#333' }} />
        </ListItem>

        {/* Relatórios */}
        <ListItem
          button
          component={Link}
          to="/relatorios"
          sx={{
            '&:hover': {
              bgcolor: '#FFD700',
              borderRadius: '12px',
            },
            padding: '14px 24px',
            marginBottom: '12px',
            borderRadius: '12px',
            backgroundColor: '#F9F9F9',
            transition: 'background-color 0.3s ease',
          }}
        >
          <ListItemIcon sx={{ color: '#333', minWidth: '40px' }}>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Relatórios" sx={{ fontSize: '18px', color: '#333' }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
