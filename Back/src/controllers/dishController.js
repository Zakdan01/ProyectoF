import pool from '../config/db.js';

export const getPlatillos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Platillo ORDER BY id_platillo ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener platillos' });
  }
};

export const createPlatillo = async (req, res) => {
  const { nombre_platillo, descripcion, precio, disponibilidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO restaurante.Platillo (nombre_platillo, descripcion, precio, disponibilidad) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre_platillo, descripcion, precio, disponibilidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear platillo' });
  }
};

export const updatePlatillo = async (req, res) => {
  const { id } = req.params;
  const { nombre_platillo, descripcion, precio, disponibilidad } = req.body;
  try {
    const result = await pool.query(
      'UPDATE restaurante.Platillo SET nombre_platillo=$1, descripcion=$2, precio=$3, disponibilidad=$4 WHERE id_platillo=$5 RETURNING *',
      [nombre_platillo, descripcion, precio, disponibilidad, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar platillo' });
  }
};

export const deletePlatillo = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Platillo WHERE id_platillo = $1', [id]);
    res.json({ success: true, message: 'Platillo eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar platillo' });
  }
};
