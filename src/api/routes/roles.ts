import { Router } from 'express';
import RolesController from '../controllers/RolesController';

const router = Router();

// GET /api/roles - Get all roles
router.get('/', RolesController.getAllRoles);

// GET /api/roles/:id - Get role by ID
router.get('/:id', RolesController.getRoleById);

// POST /api/roles - Create new role
router.post('/', RolesController.createRole);

// PUT /api/roles/:id - Update role
router.put('/:id', RolesController.updateRole);

// DELETE /api/roles/:id - Delete role
router.delete('/:id', RolesController.deleteRole);

export default router;