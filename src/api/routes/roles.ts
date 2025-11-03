import { Router } from 'express';
import RolesController from '../controllers/RolesController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin } from '../middlewares/VerifyRole';

const router = Router();

// Todas las rutas de roles son solo para administradores
// GET /api/roles - Get all roles
router.get('/', verifyToken, verifyAdmin, RolesController.getAllRoles);

// GET /api/roles/:id - Get role by ID
router.get('/:id', verifyToken, verifyAdmin, RolesController.getRoleById);

// POST /api/roles - Create new role
router.post('/', verifyToken, verifyAdmin, RolesController.createRole);

// PUT /api/roles/:id - Update role
router.put('/:id', verifyToken, verifyAdmin, RolesController.updateRole);

// DELETE /api/roles/:id - Delete role
router.delete('/:id', verifyToken, verifyAdmin, RolesController.deleteRole);

export default router;