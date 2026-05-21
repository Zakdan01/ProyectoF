import pool from '../config/db.js';

// Obtener todos los proveedores con sus ingredientes asignados
export const getSupplyMappings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id_proveedor, p.nombre_empresa, p.nombre_contacto,
       (SELECT STRING_AGG(i.nombre_ingrediente, ', ')
        FROM restaurante.Proveedor_Ingrediente pi
        JOIN restaurante.Ingrediente i ON pi.id_ingrediente = i.id_ingrediente
        WHERE pi.id_proveedor = p.id_proveedor) as ingredientes_nombres,
       (SELECT ARRAY_AGG(id_ingrediente)
        FROM restaurante.Proveedor_Ingrediente
        WHERE id_proveedor = p.id_proveedor) as ingredientes_ids
       FROM restaurante.Proveedor p 
       ORDER BY p.nombre_empresa ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener mapeo de suministros' });
  }
};

// Sincronizar ingredientes de un proveedor específico
export const syncProviderIngredients = async (req, res) => {
  const { id_proveedor } = req.params;
  const { ingredientes_ids } = req.body; // Array de IDs
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Limpiar asignaciones actuales
    await client.query(
      'DELETE FROM restaurante.Proveedor_Ingrediente WHERE id_proveedor = $1',
      [id_proveedor]
    );

    // 2. Insertar nuevas asignaciones
    if (ingredientes_ids && ingredientes_ids.length > 0) {
      for (const id_ing of ingredientes_ids) {
        await client.query(
          'INSERT INTO restaurante.Proveedor_Ingrediente (id_proveedor, id_ingrediente) VALUES ($1, $2)',
          [id_proveedor, id_ing]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Suministros actualizados correctamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: 'Error al sincronizar suministros' });
  } finally {
    client.release();
  }
};
