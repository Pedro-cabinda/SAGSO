import React from 'react';

const Alerts = ({ alerts }) => (
  <div className="alerts">
    {alerts.length > 0 && (
      <div className="alert-box">
        <h3>Alertas</h3>
        <ul>
          {alerts.map((alert, index) => <li key={index}>{alert}</li>)}
        </ul>
      </div>
    )}
  </div>
);

export default Alerts;
