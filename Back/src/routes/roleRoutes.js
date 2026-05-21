import express from 'express';
import { getRoles, createRol, deleteRol } from '../controllers/roleController.js';

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

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 */
router.post('/', createRol);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 */
router.delete('/:id', deleteRol);

export default router;
