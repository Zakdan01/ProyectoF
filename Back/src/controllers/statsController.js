import pool from '../config/db.js';

// Obtener estadísticas de popularidad de platillos
export const getPopularityStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        p.id_platillo,
        p.nombre_platillo,
        p.precio,
        SUM(op.cantidad) as total_vendido,
        SUM(op.subtotal) as ingresos_totales,
        COUNT(DISTINCT op.id_orden) as total_ordenes
       FROM restaurante.Platillo p
       LEFT JOIN restaurante.Orden_Platillo op ON p.id_platillo = op.id_platillo
       GROUP BY p.id_platillo, p.nombre_platillo, p.precio
       ORDER BY total_vendido DESC NULLS LAST`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener estadísticas de popularidad' });
  }
};

// Obtener desglose detallado de una orden o todas
export const getOrderBreakdown = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        o.id_orden,
        o.fecha_hora,
        c.nombres || ' ' || c.apellidos as cliente_nombre,
        p.nombre_platillo,
        op.cantidad,
        op.subtotal,
        o.total as orden_total
       FROM restaurante.Orden o
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       JOIN restaurante.Orden_Platillo op ON o.id_orden = op.id_orden
       JOIN restaurante.Platillo p ON op.id_platillo = p.id_platillo
       ORDER BY o.fecha_hora DESC, o.id_orden DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener desglose de órdenes' });
  }
};
