import pool from "../config/db.js";

export const getOrdenes = async (req, res) => {
  const { id_restaurante, fecha } = req.query;
  try {
    let query = `
      SELECT 
        o.id_orden, 
        o.fecha_hora, 
        o.estado, 
        o.total,
        c.nombres || ' ' || c.apellidos as cliente_nombre,
        u_caj.nombre || ' ' || u_caj.apellido_pat as cajero_nombre,
        u_mes.nombre || ' ' || u_mes.apellido_pat as mesero_nombre,
        m.n_mesa as mesa_nombre,
        r.nombre as restaurante_nombre,
        (SELECT STRING_AGG(p.nombre_platillo || ' (x' || op.cantidad || ')', ', ')
         FROM restaurante.Orden_Platillo op
         JOIN restaurante.Platillo p ON op.id_platillo = p.id_platillo
         WHERE op.id_orden = o.id_orden) as platillos
      FROM restaurante.Orden o
      JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
      JOIN restaurante.Usuario u_caj ON o.id_cajero = u_caj.id_usuario
      LEFT JOIN restaurante.Usuario u_mes ON o.id_mesero = u_mes.id_usuario
      JOIN restaurante.Mesa m ON o.id_mesa = m.id_mesa
      JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
      WHERE 1=1
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

    query += ` ORDER BY o.fecha_hora DESC`;

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
    const { id_cliente, nuevo_cliente, id_mesa, total, items, id_cajero } = req.body;

    await client.query("BEGIN");

    let finalClienteId = id_cliente;

    // 1. Manejo inteligente de cliente
    if (nuevo_cliente) {
      const existingClient = await client.query(
        "SELECT id_cliente FROM restaurante.Cliente WHERE ci = $1",
        [nuevo_cliente.ci]
      );

      if (existingClient.rows.length > 0) {
        finalClienteId = existingClient.rows[0].id_cliente;
      } else {
        const clientRes = await client.query(
          `INSERT INTO restaurante.Cliente (nombres, apellidos, ci, fecha_registro) 
           VALUES ($1, $2, $3, NOW()) RETURNING id_cliente`,
          [nuevo_cliente.nombres, nuevo_cliente.apellidos, nuevo_cliente.ci],
        );
        finalClienteId = clientRes.rows[0].id_cliente;
      }
    }

    // 2. Crear la Orden (Quitamos id_restaurante porque no existe en la tabla Orden)
    // El id_restaurante se hereda de la mesa o el cajero en las consultas
    const orderRes = await client.query(
      `INSERT INTO restaurante.Orden (id_cliente, id_mesa, total, estado, fecha_hora, id_cajero) 
       VALUES ($1, $2, $3, 'EN PREPARACIÓN', NOW(), $4) RETURNING id_orden`,
      [finalClienteId, id_mesa || null, total, id_cajero],
    );
    const id_orden = orderRes.rows[0].id_orden;

    // 3. Crear los Detalles
    for (const item of items) {
      await client.query(
        `INSERT INTO restaurante.Orden_Platillo (id_orden, id_platillo, cantidad, subtotal) 
         VALUES ($1, $2, $3, $4)`,
        [id_orden, item.id_platillo, item.cantidad, item.subtotal],
      );
    }

    // 4. Crear el Pago (Solo con columnas existentes: id_orden, monto_pago)
    await client.query(
      `INSERT INTO restaurante.Pago (id_orden, monto_pago, fecha_pago) 
       VALUES ($1, $2, NOW())`,
      [id_orden, total],
    );

    await client.query("COMMIT");
    res.status(201).json({ success: true, id_orden, id_cliente: finalClienteId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en BD:", err.message);
    res.status(500).json({ error: "Error al crear la orden: " + err.message });
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
              m.n_mesa as mesa_nombre,
              STRING_AGG(p.nombre_platillo || ' (x' || op.cantidad || ')', ', ') as platillos
       FROM restaurante.Orden o
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       JOIN restaurante.mesa m ON o.id_mesa = m.id_mesa
       JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
       JOIN restaurante.Orden_Platillo op ON o.id_orden = op.id_orden
       JOIN restaurante.Platillo p ON op.id_platillo = p.id_platillo
       WHERE o.estado = 'EN PREPARACIÓN'
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
              m.n_mesa as mesa_nombre,
              STRING_AGG(p.nombre_platillo || ' (x' || op.cantidad || ')', ', ') as platillos
       FROM restaurante.Orden o
       JOIN restaurante.Cliente c ON o.id_cliente = c.id_cliente
       JOIN restaurante.mesa m ON o.id_mesa = m.id_mesa
       JOIN restaurante.Restaurante r ON m.id_restaurante = r.id_restaurante
       JOIN restaurante.Orden_Platillo op ON o.id_orden = op.id_orden
       JOIN restaurante.Platillo p ON op.id_platillo = p.id_platillo
       WHERE o.estado = 'LISTO PARA ENTREGA'
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
  const estadoUpper = estado.toUpperCase();
  try {
    if (id_mesero) {
      await pool.query(
        "UPDATE restaurante.Orden SET estado = $1, id_mesero = $2 WHERE id_orden = $3",
        [estadoUpper, id_mesero, id]
      );
    } else {
      await pool.query(
        "UPDATE restaurante.Orden SET estado = $1 WHERE id_orden = $2",
        [estadoUpper, id]
      );
    }
    res.json({ success: true, message: "Estado/Asignación actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la orden" });
  }
};
