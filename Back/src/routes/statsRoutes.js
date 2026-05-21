import express from 'express';
import { getPopularityStats, getOrderBreakdown } from '../controllers/statsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/reportes/popularidad:
 *   get:
 *     summary: Obtener estadísticas de popularidad
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 */
router.get('/popularidad', getPopularityStats);

/**
 * @swagger
 * /api/reportes/desglose:
 *   get:
 *     summary: Obtener desglose de ordenes
 *     tags: [Reportes]
 *     responses:
 *       200:
 *         description: Desglose obtenido
 */
router.get('/desglose', getOrderBreakdown);

export default router;
