import express from 'express';
import { getClientes } from '../controllers/clientController.js';

const router = express.Router();

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener lista de clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida
 */
router.get('/', getClientes);

export default router;
