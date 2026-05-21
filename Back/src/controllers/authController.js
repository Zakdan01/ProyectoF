import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const result = await pool.query(
      `SELECT u.*, r.nombre as rol_nombre 
       FROM restaurante.Usuario u 
       JOIN restaurante.Rol r ON u.id_rol = r.id_rol 
       WHERE u.correo = $1`,
      [correo]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Verificación de contraseña (soporta texto plano por ahora para no romper lo existente, 
      // pero comparará con hash si detecta uno)
      let isMatch = false;
      if (user.contrasena.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(contrasena, user.contrasena);
      } else {
        isMatch = contrasena === user.contrasena;
      }

      if (isMatch) {
        delete user.contrasena;
        
        const token = jwt.sign(
          { id_usuario: user.id_usuario, rol: user.rol_nombre },
          process.env.JWT_SECRET || 'secret_key_123',
          { expiresIn: '24h' }
        );

        res.json({ success: true, user, token });
      } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
