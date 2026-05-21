import express from 'express';
import { getSupplyMappings, syncProviderIngredients } from '../controllers/supplyController.js';

const router = express.Router();

/**
 * @swagger
 * /api/suministros:
 *   get:
 *     summary: Obtener mapeo de suministros
 *     tags: [Suministros]
 *     responses:
 *       200:
 *         description: Mapeo de suministros obtenido
 */
router.get('/', getSupplyMappings);

/**
 * @swagger
 * /api/suministros/{id_proveedor}:
 *   put:
 *     summary: Sincronizar ingredientes del proveedor
 *     tags: [Suministros]
 *     parameters:
 *       - in: path
 *         name: id_proveedor
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingredientes sincronizados
 */
router.put('/:id_proveedor', syncProviderIngredients);

export default router;
