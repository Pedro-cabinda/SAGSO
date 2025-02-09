// Entradas.js
import React, { useState } from 'react';

const Entradas = ({ onAddItem }) => {
  const [item, setItem] = useState({
    codigo: '',
    nome: '',
    categoria: '',
    quantidade: 0,
    unidade: '',
    fabricante: '',
    lote: '',
    dataExpiracao: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem(item);
    setItem({ codigo: '', nome: '', categoria: '', quantidade: 0, unidade: '', fabricante: '', lote: '', dataExpiracao: '' });
  };

  return (
    <div className="entradas">
      <h2>Adicionar Item ao Estoque</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos de entrada, similares ao seu código atual */}
        <button type="submit" className="btn">Adicionar</button>
      </form>
    </div>
  );
};

export default Entradas;
