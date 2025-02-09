// Saidas.js
import React, { useState } from 'react';

const Saidas = ({ stock, onUpdateStock }) => {
  const [saida, setSaida] = useState({ codigo: '', quantidade: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = stock.find((item) => item.codigo === saida.codigo);
    if (item && item.quantidade >= saida.quantidade) {
      onUpdateStock(item.id, item.quantidade - saida.quantidade);
    } else {
      alert('Quantidade insuficiente em estoque!');
    }
    setSaida({ codigo: '', quantidade: 0 });
  };

  return (
    <div className="saidas">
      <h2>Registrar Saída de Itens</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos para registrar saída */}
        <button type="submit" className="btn">Registrar Saída</button>
      </form>
    </div>
  );
};

export default Saidas;
