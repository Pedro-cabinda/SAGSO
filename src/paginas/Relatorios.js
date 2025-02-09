// Relatorios.js
import React from 'react';

const Relatorios = ({ stock }) => {
  const gerarRelatorio = () => {
    // Lógica para gerar relatório em PDF ou Excel
  };

  const alertas = stock.filter((item) => 
    item.dataExpiracao && new Date(item.dataExpiracao) < new Date(new Date().setDate(new Date().getDate() + 30))
  );

  return (
    <div className="relatorios">
      <h2>Relatórios e Alertas</h2>
      <div className="alertas">
        <h3>Itens Próximos do Vencimento</h3>
        <ul>
          {alertas.map((item) => (
            <li key={item.id}>{item.nome} - Expira em {item.dataExpiracao}</li>
          ))}
        </ul>
      </div>
      <button onClick={gerarRelatorio} className="btn">Gerar Relatório</button>
    </div>
  );
};

export default Relatorios;
