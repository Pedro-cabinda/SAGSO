// src/componentes/RotaPrivada.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RotaPrivada = () => {
  const usuarioAutenticado = localStorage.getItem('token'); // ou verifique outro dado

  return usuarioAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RotaPrivada;
