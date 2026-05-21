import express from 'express';
import { getRecipeMappings, syncDishIngredients } from '../controllers/recipeController.js';

const router = express.Router();

/**
 * @swagger
 * /api/recetas:
 *   get:
 *     summary: Obtener mapeo de recetas
 *     tags: [Recetas]
 *     responses:
 *       200:
 *         description: Mapeo de recetas obtenido
 */
router.get('/', getRecipeMappings);

/**
 * @swagger
 * /api/recetas/{id_platillo}:
 *   put:
 *     summary: Sincronizar ingredientes del platillo
 *     tags: [Recetas]
 *     parameters:
 *       - in: path
 *         name: id_platillo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredientes sincronizados
 */
router.put('/:id_platillo', syncDishIngredients);

export default router;
