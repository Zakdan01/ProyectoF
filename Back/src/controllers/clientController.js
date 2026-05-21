import pool from '../config/db.js';

export const getClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Cliente ORDER BY id_cliente ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};
