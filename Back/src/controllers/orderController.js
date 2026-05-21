import pool from "../config/db.js";

export const getOrdenes = async (req, res) => {
  const { id_restaurante, fecha } = req.query;
  try {
    let query = `
      SELECT o.*, c.nombres as cliente_nombre, c.apellidos as cliente_apellido, r.nombre as restaurante_nombre
	FROM restaurante.Orden o
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
	   JOIN restaurante.mesa m on o.id_mesa = m.id_mesa
       JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
       ORDER BY o.fecha_hora DESC
    `;
    const params = [];

    if (id_restaurante) {
      params.push(id_restaurante);
      query += ` AND m.id_restaurante = $${params.length}`;
    }
    
    if (fecha) {
      params.push(fecha);
      query += ` AND DATE(o.fecha_hora) = $${params.length}`;
    }

    query += ` DESCGROUP BY o.id_orden, c.id_cliente, m.id_mesa, r.id_restaurante
               ORDER BY o.fecha_hora `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
};

export const createOrden = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_cliente, nuevo_cliente, id_restaurante, id_mesa, total, items } =
      req.body;

    await client.query("BEGIN");

    let finalClienteId = id_cliente;

    // 1. Si es un cliente nuevo, registrarlo primero
    if (nuevo_cliente) {
      const clientRes = await client.query(
        `INSERT INTO restaurante.Cliente (nombres, apellidos, ci, fecha_registro) 
         VALUES ($1, $2, $3, NOW()) RETURNING id_cliente`,
        [nuevo_cliente.nombres, nuevo_cliente.apellidos, nuevo_cliente.ci],
      );
      finalClienteId = clientRes.rows[0].id_cliente;
    }

    // 2. Crear la Orden
    const orderRes = await client.query(
      `INSERT INTO restaurante.Orden (id_cliente, id_restaurante, id_mesa, total, estado, fecha_hora) 
       VALUES ($1, $2, $3, $4, 'En Preparación', NOW()) RETURNING id_orden`,
      [finalClienteId, id_restaurante, id_mesa || null, total],
    );
    const id_orden = orderRes.rows[0].id_orden;

    // 3. Crear los Detalles (Orden_Platillo)
    for (const item of items) {
      const itemSubtotal = Number(item.subtotal);
      await client.query(
        `INSERT INTO restaurante.Orden_Platillo (id_orden, id_platillo, cantidad, subtotal) 
         VALUES ($1, $2, $3, $4)`,
        [id_orden, item.id_platillo, item.cantidad, itemSubtotal],
      );
    }

    // 4. Crear el Pago
    await client.query(
      `INSERT INTO restaurante.Pago (id_orden, monto_pago, fecha_pago, metodo_pago) 
       VALUES ($1, $2, NOW(), 'Efectivo')`,
      [id_orden, total],
    );

    await client.query("COMMIT");
    res
      .status(201)
      .json({ success: true, id_orden, id_cliente: finalClienteId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ error: "Error al crear la orden completa" });
  } finally {
    client.release();
  }
};

export const getOrdenesPreparacion = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
              c.nombres as cliente_nombre, 
              c.apellidos as cliente_apellido, 
              r.nombre as restaurante_nombre,
              STRING_AGG(p.nombre_platillo || ' (x' || op.cantidad || ')', ', ') as platillos
       FROM restaurante.Orden o
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       JOIN restaurante.mesa m ON o.id_mesa = m.id_mesa
       JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
       JOIN restaurante.Orden_Platillo op ON o.id_orden = op.id_orden
       JOIN restaurante.Platillo p ON op.id_platillo = p.id_platillo
       WHERE o.estado = 'En preparacion'
       GROUP BY o.id_orden, c.id_cliente, m.id_mesa, r.id_restaurante
       ORDER BY o.fecha_hora ASC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener órdenes en preparación" });
  }
};

export const getOrdenesListasParaEntrega = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
              c.nombres as cliente_nombre, 
              c.apellidos as cliente_apellido, 
              r.nombre as restaurante_nombre,
              STRING_AGG(p.nombre_platillo || ' (x' || op.cantidad || ')', ', ') as platillos
       FROM restaurante.Orden o
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       JOIN restaurante.mesa m ON o.id_mesa = m.id_mesa
       JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
       JOIN restaurante.Orden_Platillo op ON o.id_orden = op.id_orden
       JOIN restaurante.Platillo p ON op.id_platillo = p.id_platillo
       WHERE o.estado = 'Listo para entrega'
       GROUP BY o.id_orden, c.id_cliente, m.id_mesa, r.id_restaurante
       ORDER BY o.fecha_hora ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener órdenes listas para entrega" });
  }
};

export const updateOrdenEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, id_mesero } = req.body;
  try {
    if (id_mesero) {
      await pool.query(
        "UPDATE restaurante.Orden SET estado = $1, id_mesero = $2 WHERE id_orden = $3",
        [estado, id_mesero, id]
      );
    } else {
      await pool.query(
        "UPDATE restaurante.Orden SET estado = $1 WHERE id_orden = $2",
        [estado, id]
      );
    }
    res.json({ success: true, message: "Estado/Asignación actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la orden" });
  }
};
