import express from 'express';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../controllers/providerController.js';

const router = express.Router();

/**
 * @swagger
 * /api/proveedores:
 *   get:
 *     summary: Obtener lista de proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores obtenida
 */
router.get('/', getProveedores);

/**
 * @swagger
 * /api/proveedores:
 *   post:
 *     summary: Crear nuevo proveedor
 *     tags: [Proveedores]
 *     responses:
 *       201:
 *         description: Proveedor creado
 */
router.post('/', createProveedor);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   put:
 *     summary: Actualizar proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proveedor actualizado
 */
router.put('/:id', updateProveedor);

/**
 * @swagger
 * /api/proveedores/{id}:
 *   delete:
 *     summary: Eliminar proveedor
 *     tags: [Proveedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proveedor eliminado
 */
router.delete('/:id', deleteProveedor);

export default router;
