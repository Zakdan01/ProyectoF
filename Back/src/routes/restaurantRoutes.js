import express from 'express';
import { getRestaurantes, createRestaurante, updateRestaurante, deleteRestaurante } from '../controllers/restaurantController.js';

const router = express.Router();

/**
 * @swagger
 * /api/restaurantes:
 *   get:
 *     summary: Obtener lista de restaurantes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes obtenida
 */
router.get('/', getRestaurantes);

/**
 * @swagger
 * /api/restaurantes:
 *   post:
 *     summary: Crear nuevo restaurante
 *     tags: [Restaurantes]
 *     responses:
 *       201:
 *         description: Restaurante creado
 */
router.post('/', createRestaurante);

/**
 * @swagger
 * /api/restaurantes/{id}:
 *   put:
 *     summary: Actualizar restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante actualizado
 */
router.put('/:id', updateRestaurante);

/**
 * @swagger
 * /api/restaurantes/{id}:
 *   delete:
 *     summary: Eliminar restaurante
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurante eliminado
 */
router.delete('/:id', deleteRestaurante);

export default router;
