import pool from '../config/db.js';

export const getAuditLogs = async (req, res) => {
  const { table } = req.params;
  
  // Lista blanca de tablas para evitar SQL Injection
  const allowedTables = ['usuarios', 'restaurantes', 'platillos'];
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Tabla de auditoría no válida' });
  }

  try {
    const query = `SELECT * FROM restaurante.log_${table} ORDER BY fecha_evento DESC`;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener logs de auditoría' });
  }
};
