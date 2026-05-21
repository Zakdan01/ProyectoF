import express from 'express';
import { getMesas } from '../controllers/tableController.js';

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

export default router;
