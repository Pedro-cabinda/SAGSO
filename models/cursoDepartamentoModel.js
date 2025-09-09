const db = require('../config/db');

exports.listar = async () => {
  const [rows] = await db.query('SELECT id, tipo, nome FROM curso_departamento ORDER BY tipo, nome');
  return rows;
};
