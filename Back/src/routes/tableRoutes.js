import express from 'express';
import { getMesas, createMesa, updateMesa, deleteMesa } from '../controllers/tableController.js';

const router = express.Router();

/**
 * @swagger
 * /api/mesas:
 *   get:
 *     summary: Obtener lista de mesas
 *     tags: [Mesas]
 *     responses:
 *       200:
 *         description: Lista de mesas obtenida
 */
router.get('/', getMesas);

/**
 * @swagger
 * /api/mesas:
 *   post:
 *     summary: Crear nueva mesa
 *     tags: [Mesas]
 *     responses:
 *       201:
 *         description: Mesa creada
 */
router.post('/', createMesa);

/**
 * @swagger
 * /api/mesas/{id}:
 *   put:
 *     summary: Actualizar mesa
 *     tags: [Mesas]
 */
router.put('/:id', updateMesa);

/**
 * @swagger
 * /api/mesas/{id}:
 *   delete:
 *     summary: Eliminar mesa
 *     tags: [Mesas]
 */
router.delete('/:id', deleteMesa);

export default router;
