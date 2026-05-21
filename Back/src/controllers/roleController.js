import pool from '../config/db.js';

export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Rol ORDER BY id_rol ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

export const createRol = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO restaurante.Rol (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear rol' });
  }
};

export const deleteRol = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Rol WHERE id_rol = $1', [id]);
    res.json({ success: true, message: 'Rol eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar rol' });
  }
};
