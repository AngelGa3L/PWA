import { Router } from 'express';
import UsersController from '../controllers/UsersController';

const router = Router();

// GET /api/users - Get all users
router.get('/', UsersController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', UsersController.getUserById);

// POST /api/users - Create new user
router.post('/', UsersController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', UsersController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', UsersController.deleteUser);

// GET /api/users/:id/polls - Get polls created by user
router.get('/:id/polls', UsersController.getUserPolls);

// GET /api/users/:id/responses - Get responses by user
router.get('/:id/responses', UsersController.getUserResponses);

export default router;