import pool from '../config/db.js';

export const getProveedores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Proveedor ORDER BY id_proveedor ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};

export const createProveedor = async (req, res) => {
  const { nombre_empresa, nombre_contacto, telefono, correo, direccion } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO restaurante.Proveedor (nombre_empresa, nombre_contacto, telefono, correo, direccion) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre_empresa, nombre_contacto, telefono, correo, direccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
};

export const updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre_empresa, nombre_contacto, telefono, correo, direccion } = req.body;
  try {
    const result = await pool.query(
      `UPDATE restaurante.Proveedor SET nombre_empresa=$1, nombre_contacto=$2, telefono=$3, correo=$4, direccion=$5 
       WHERE id_proveedor=$6 RETURNING *`,
      [nombre_empresa, nombre_contacto, telefono, correo, direccion, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
};

export const deleteProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Proveedor WHERE id_proveedor = $1', [id]);
    res.json({ success: true, message: 'Proveedor eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
};
