import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.*, r.nombre as rol_nombre, res.nombre as restaurante_nombre 
       FROM restaurante.Usuario u
       JOIN restaurante.Rol r ON u.id_rol = r.id_rol
       JOIN restaurante.Restaurante res ON u.id_restaurante = res.id_restaurante
       ORDER BY u.id_usuario ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

export const createUsuario = async (req, res) => {
  const { nombre, apellido_pat, apellido_mat, ci, telefono, correo, contrasena, estado, id_rol, id_restaurante } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const result = await pool.query(
      `INSERT INTO restaurante.Usuario 
       (nombre, apellido_pat, apellido_mat, ci, telefono, correo, contrasena, estado, id_rol, id_restaurante) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nombre, apellido_pat, apellido_mat, ci, telefono, correo, hashedPassword, estado, id_rol, id_restaurante]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido_pat, apellido_mat, ci, telefono, correo, estado, id_rol, id_restaurante } = req.body;
  try {
    const result = await pool.query(
      `UPDATE restaurante.Usuario 
       SET nombre=$1, apellido_pat=$2, apellido_mat=$3, ci=$4, telefono=$5, correo=$6, estado=$7, id_rol=$8, id_restaurante=$9 
       WHERE id_usuario=$10 RETURNING *`,
      [nombre, apellido_pat, apellido_mat, ci, telefono, correo, estado, id_rol, id_restaurante, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Usuario WHERE id_usuario = $1', [id]);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Obtener el usuario
    const userResult = await pool.query('SELECT contrasena FROM restaurante.Usuario WHERE id_usuario = $1', [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    // 2. Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // 3. Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // 4. Actualizar en BD
    await pool.query('UPDATE restaurante.Usuario SET contrasena = $1 WHERE id_usuario = $2', [hashedNewPassword, id]);

    res.json({ success: true, message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Rol');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};
