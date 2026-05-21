import pool from '../config/db.js';

export const getIngredientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurante.Ingrediente ORDER BY id_ingrediente ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener ingredientes' });
  }
};

export const createIngrediente = async (req, res) => {
  const { nombre_ingrediente, descripcion, stock_actual, unidad_medida, estado } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO restaurante.Ingrediente (nombre_ingrediente, descripcion, stock_actual, unidad_medida, estado) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre_ingrediente, descripcion, stock_actual, unidad_medida, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear ingrediente' });
  }
};

export const updateIngrediente = async (req, res) => {
  const { id } = req.params;
  const { nombre_ingrediente, descripcion, stock_actual, unidad_medida, estado } = req.body;
  try {
    const result = await pool.query(
      `UPDATE restaurante.Ingrediente SET nombre_ingrediente=$1, descripcion=$2, stock_actual=$3, unidad_medida=$4, estado=$5 
       WHERE id_ingrediente=$6 RETURNING *`,
      [nombre_ingrediente, descripcion, stock_actual, unidad_medida, estado, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al actualizar ingrediente' });
  }
};

export const deleteIngrediente = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM restaurante.Ingrediente WHERE id_ingrediente = $1', [id]);
    res.json({ success: true, message: 'Ingrediente eliminado' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al eliminar ingrediente' });
  }
};
