import express from 'express';
import { getOrdenes, createOrden, getOrdenesPreparacion, getOrdenesListasParaEntrega, updateOrdenEstado } from '../controllers/orderController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     summary: Obtener lista de ordenes
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: Lista de ordenes obtenida
 */
router.get('/', getOrdenes);

/**
 * @swagger
 * /api/ordenes:
 *   post:
 *     summary: Crear nueva orden
 *     tags: [Ordenes]
 *     responses:
 *       201:
 *         description: Orden creada
 */
router.post('/', createOrden);

/**
 * @swagger
 * /api/ordenes/preparacion:
 *   get:
 *     summary: Obtener ordenes en preparación
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: Lista de ordenes obtenida
 */
router.get('/preparacion', getOrdenesPreparacion);

/**
 * @swagger
 * /api/ordenes/listas:
 *   get:
 *     summary: Obtener ordenes listas para entrega
 *     tags: [Ordenes]
 *     responses:
 *       200:
 *         description: Lista de ordenes obtenida
 */
router.get('/listas', getOrdenesListasParaEntrega);

/**
 * @swagger
 * /api/ordenes/{id}/estado:
 *   put:
 *     summary: Actualizar estado de orden
 *     tags: [Ordenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado de orden actualizado
 */
router.put('/:id/estado', updateOrdenEstado);

export default router;
