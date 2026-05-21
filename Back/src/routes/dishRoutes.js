import express from 'express';
import { getPlatillos, createPlatillo, updatePlatillo, deletePlatillo } from '../controllers/dishController.js';

const router = express.Router();

/**
 * @swagger
 * /api/platillos:
 *   get:
 *     summary: Obtener lista de platillos
 *     tags: [Platillos]
 *     responses:
 *       200:
 *         description: Lista de platillos obtenida
 */
router.get('/', getPlatillos);

/**
 * @swagger
 * /api/platillos:
 *   post:
 *     summary: Crear nuevo platillo
 *     tags: [Platillos]
 *     responses:
 *       201:
 *         description: Platillo creado
 */
router.post('/', createPlatillo);

/**
 * @swagger
 * /api/platillos/{id}:
 *   put:
 *     summary: Actualizar platillo
 *     tags: [Platillos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Platillo actualizado
 */
router.put('/:id', updatePlatillo);

/**
 * @swagger
 * /api/platillos/{id}:
 *   delete:
 *     summary: Eliminar platillo
 *     tags: [Platillos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Platillo eliminado
 */
router.delete('/:id', deletePlatillo);

export default router;
