import express from 'express';
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../controllers/ingredientController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ingredientes:
 *   get:
 *     summary: Obtener lista de ingredientes
 *     tags: [Ingredientes]
 *     responses:
 *       200:
 *         description: Lista de ingredientes obtenida
 */
router.get('/', getIngredientes);

/**
 * @swagger
 * /api/ingredientes:
 *   post:
 *     summary: Crear nuevo ingrediente
 *     tags: [Ingredientes]
 *     responses:
 *       201:
 *         description: Ingrediente creado
 */
router.post('/', createIngrediente);

/**
 * @swagger
 * /api/ingredientes/{id}:
 *   put:
 *     summary: Actualizar ingrediente
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingrediente actualizado
 */
router.put('/:id', updateIngrediente);

/**
 * @swagger
 * /api/ingredientes/{id}:
 *   delete:
 *     summary: Eliminar ingrediente
 *     tags: [Ingredientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingrediente eliminado
 */
router.delete('/:id', deleteIngrediente);

export default router;
