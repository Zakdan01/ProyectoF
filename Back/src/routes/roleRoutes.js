import express from 'express';
import { getRoles } from '../controllers/roleController.js';

const router = express.Router();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener lista de roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida
 */
router.get('/', getRoles);

export default router;
