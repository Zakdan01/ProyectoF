import pool from '../config/db.js';

export const getPagos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, o.total as orden_total, c.nombres as cliente_nombre, c.apellidos as cliente_apellido
       FROM restaurante.Pago p
       JOIN restaurante.Orden o ON p.id_orden = o.id_orden
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       ORDER BY p.fecha_pago DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
};
