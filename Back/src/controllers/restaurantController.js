import pool from '../config/db.js';

export const getRestaurantes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Restaurante ORDER BY id_restaurante ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener restaurantes' });
  }
};

export const createRestaurante = async (req, res) => {
  const { nombre, direccion, telefono, ciudad, estado, hora_apertura, hora_cierre } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO restaurante.Restaurante 
       (nombre, direccion, telefono, ciudad, estado, hora_apertura, hora_cierre) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, direccion, telefono, ciudad, estado, hora_apertura || null, hora_cierre || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear restaurante' });
  }
};

export const updateRestaurante = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, ciudad, estado, hora_apertura, hora_cierre } = req.body;
  try {
    const result = await pool.query(
      `UPDATE restaurante.Restaurante 
       SET nombre=$1, direccion=$2, telefono=$3, ciudad=$4, estado=$5, hora_apertura=$6, hora_cierre=$7 
       WHERE id_restaurante=$8 RETURNING *`,
      [nombre, direccion, telefono, ciudad, estado, hora_apertura || null, hora_cierre || null, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar restaurante' });
  }
};

export const deleteRestaurante = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Restaurante WHERE id_restaurante = $1', [id]);
    res.json({ success: true, message: 'Restaurante eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar restaurante' });
  }
};
