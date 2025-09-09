const db = require('../config/db');

// Total de atendimentos por mês
async function obterAtendimentosMensais() {
  const [rows] = await db.query(`
    SELECT DATE_FORMAT(data_atendimento, '%b') AS mes, COUNT(*) AS total
    FROM atendimentos
    WHERE data_atendimento >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY mes
    ORDER BY MONTH(STR_TO_DATE(mes, '%b'))
  `);
  return rows;
}

// Total de exames por mês
async function obterExamesPorMes() {
  const [rows] = await db.query(`
    SELECT DATE_FORMAT(data_exame, '%b') AS mes, COUNT(*) AS total
    FROM exames
    WHERE data_exame >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY mes
    ORDER BY MONTH(STR_TO_DATE(mes, '%b'))
  `);
  return rows;
}

// Distribuição de exames por tipo
async function obterDistribuicaoPorTipoExame() {
  const [rows] = await db.query(`
    SELECT te.nome AS tipo, COUNT(e.id) AS total
    FROM exames e
    JOIN tipos_exames te ON e.tipo_exame_id = te.id
    GROUP BY te.nome
    ORDER BY total DESC
  `);
  return rows;
}

// Total de exames pendentes por mês
async function obterExamesPendentesPorMes() {
  const [rows] = await db.query(`
    SELECT DATE_FORMAT(data_exame, '%b') AS mes, COUNT(*) AS total
    FROM exames
    WHERE status = 'pendente' AND data_exame >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY mes
    ORDER BY MONTH(STR_TO_DATE(mes, '%b'))
  `);
  return rows;
}

// Absenteísmo (placeholder)
async function obterAbsenteismo() {
  return 0;
}

// Totais gerais
async function obterTotais() {
  const [[{ totalAtendimentos }]] = await db.query('SELECT COUNT(*) AS totalAtendimentos FROM atendimentos');
  const [[{ totalExames }]] = await db.query('SELECT COUNT(*) AS totalExames FROM exames');
  return { totalAtendimentos, totalExames };
}

// Atendimentos por curso/departamento
async function obterAtendimentosPorCurso() {
  const [rows] = await db.query(`
    SELECT cd.nome AS curso, COUNT(*) AS total
    FROM pacientes p
    JOIN curso_departamento cd ON cd.id = p.curso_departamento_id
    JOIN atendimentos a ON a.paciente_id = p.id
    WHERE p.curso_departamento_id IS NOT NULL
    GROUP BY cd.nome
    ORDER BY total DESC
  `);
  return rows;
}

// Diagnósticos mais comuns
async function obterDiagnosticosMaisComuns() {
  const [rows] = await db.query(`
    SELECT diagnostico, COUNT(*) AS total
    FROM atendimentos
    GROUP BY diagnostico
    ORDER BY total DESC
    LIMIT 5
  `);
  return rows;
}

// Exames pendentes por tipo
async function obterExamesPendentesPorTipo() {
  const [rows] = await db.query(`
    SELECT te.nome AS tipo, COUNT(*) AS total
    FROM exames e
    JOIN tipos_exames te ON e.tipo_exame_id = te.id
    WHERE e.status = 'pendente'
    GROUP BY tipo_exame_id
  `);
  return rows;
}

// Atendimentos por tipo de paciente
async function obterDistribuicaoPorTipoUsuario() {
  const [rows] = await db.query(`
    SELECT p.tipo_paciente, COUNT(*) AS total
    FROM pacientes p
    JOIN atendimentos a ON a.paciente_id = p.id
    GROUP BY p.tipo_paciente
  `);
  return rows;
}

module.exports = {
  obterAtendimentosMensais,
  obterExamesPorMes,
  obterDistribuicaoPorTipoExame,
  obterExamesPendentesPorMes,
  obterAbsenteismo,
  obterTotais,
  obterAtendimentosPorCurso,
  obterDiagnosticosMaisComuns,
  obterExamesPendentesPorTipo,
  obterDistribuicaoPorTipoUsuario
};
