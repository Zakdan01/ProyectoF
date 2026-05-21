import pool from '../config/db.js';

export const getMesas = async (req, res) => {
  const { id_restaurante } = req.query;
  try {
    let query = 'SELECT * FROM restaurante.Mesa';
    let params = [];
    
    if (id_restaurante) {
      query += ' WHERE id_restaurante = $1';
      params.push(id_restaurante);
    }
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mesas' });
  }
};
