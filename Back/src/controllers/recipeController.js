import pool from '../config/db.js';

// Obtener todos los platillos con sus ingredientes asignados (el "recetario")
export const getRecipeMappings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id_platillo, p.nombre_platillo, p.precio,
       (SELECT STRING_AGG(i.nombre_ingrediente, ', ')
        FROM restaurante.Platillo_Ingrediente pi
        JOIN restaurante.Ingrediente i ON pi.id_ingrediente = i.id_ingrediente
        WHERE pi.id_platillo = p.id_platillo) as ingredientes_nombres,
       (SELECT ARRAY_AGG(id_ingrediente)
        FROM restaurante.Platillo_Ingrediente
        WHERE id_platillo = p.id_platillo) as ingredientes_ids
       FROM restaurante.Platillo p 
       ORDER BY p.nombre_platillo ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener el recetario' });
  }
};

// Sincronizar ingredientes de un platillo específico
export const syncDishIngredients = async (req, res) => {
  const { id_platillo } = req.params;
  const { ingredientes_ids } = req.body; // Array de IDs
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 1. Limpiar ingredientes actuales de la receta
    await client.query(
      'DELETE FROM restaurante.Platillo_Ingrediente WHERE id_platillo = $1',
      [id_platillo]
    );

    // 2. Insertar nuevos ingredientes a la receta
    if (ingredientes_ids && ingredientes_ids.length > 0) {
      for (const id_ing of ingredientes_ids) {
        await client.query(
          'INSERT INTO restaurante.Platillo_Ingrediente (id_platillo, id_ingrediente) VALUES ($1, $2)',
          [id_platillo, id_ing]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true, message: 'Receta actualizada correctamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: 'Error al sincronizar ingredientes del platillo' });
  } finally {
    client.release();
  }
};
