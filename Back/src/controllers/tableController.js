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
    query += ' ORDER BY id_mesa ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener mesas' });
  }
};

export const createMesa = async (req, res) => {
  const { n_mesa, capacidad, estado, id_restaurante } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO restaurante.Mesa (n_mesa, capacidad, estado, id_restaurante) VALUES ($1, $2, $3, $4) RETURNING *',
      [n_mesa, capacidad, estado || 'Disponible', id_restaurante]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear mesa' });
  }
};

export const updateMesa = async (req, res) => {
  const { id } = req.params;
  const { n_mesa, capacidad, estado, id_restaurante } = req.body;
  try {
    const result = await pool.query(
      'UPDATE restaurante.Mesa SET n_mesa=$1, capacidad=$2, estado=$3, id_restaurante=$4 WHERE id_mesa=$5 RETURNING *',
      [n_mesa, capacidad, estado, id_restaurante, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar mesa' });
  }
};

export const deleteMesa = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Mesa WHERE id_mesa = $1', [id]);
    res.json({ success: true, message: 'Mesa eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mesa' });
  }
};
