import pool from '../config/db.js';

export const getPagos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.id_pago, 
        p.fecha_pago, 
        p.monto_pago, 
        o.id_orden, 
        c.nombres || ' ' || c.apellidos as cliente_nombre,
        r.nombre as restaurante_nombre
       FROM restaurante.Pago p
       JOIN restaurante.Orden o ON p.id_orden = o.id_orden
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       JOIN restaurante.Mesa m ON o.id_mesa = m.id_mesa
       JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
       ORDER BY p.fecha_pago DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
};
