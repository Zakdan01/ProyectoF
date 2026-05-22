import express from 'express';
import { getUsuarios, getRoles, createUsuario, updateUsuario, deleteUsuario, changePassword } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener lista de usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida
 */
router.get('/', getUsuarios);

/**
 * @swagger
 * /api/usuarios/roles:
 *   get:
 *     summary: Obtener lista de roles
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida
 */
router.get('/roles', getRoles);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', createUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:id', updateUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/:id', deleteUsuario);

/**
 * @swagger
 * /api/usuarios/{id}/password:
 *   put:
 *     summary: Cambiar contraseña de usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 */
router.put('/:id/password', changePassword);

export default router;
