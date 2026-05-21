import express from 'express';
import { getPagos } from '../controllers/paymentController.js';

const router = express.Router();

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Obtener lista de pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida
 */
router.get('/', getPagos);

export default router;
