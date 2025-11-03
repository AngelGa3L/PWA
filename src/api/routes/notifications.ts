import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin, verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// POST /api/notifications - Crear notificación (solo admin)
router.post('/', verifyToken, verifyAdmin, NotificationController.createNotification);

// GET /api/notifications - Obtener todas las notificaciones (solo admin)
router.get('/', verifyToken, verifyAdmin, NotificationController.getAllNotifications);

// GET /api/notifications/user/:userId - Obtener notificaciones de usuario (autenticado)
router.get('/user/:userId', verifyToken, verifyAuthenticated, NotificationController.getNotificationsByUser);

// GET /api/notifications/pending - Obtener notificaciones pendientes (solo admin)
router.get('/pending', verifyToken, verifyAdmin, NotificationController.getPendingNotifications);

// PATCH /api/notifications/:id/sent - Marcar como enviada (solo admin)
router.patch('/:id/sent', verifyToken, verifyAdmin, NotificationController.markAsSent);

// DELETE /api/notifications/:id - Eliminar notificación (solo admin)
router.delete('/:id', verifyToken, verifyAdmin, NotificationController.deleteNotification);

export default router;
