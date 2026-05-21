import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

/**
 * @swagger
 * /api/auditoria/{table}:
 *   get:
 *     summary: Obtener logs de auditoría
 *     tags: [Auditoria]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs de auditoría obtenidos
 */
router.get('/:table', getAuditLogs);

export default router;
