import { Router } from 'express';
import PushNotificationController from '../controllers/PushNotificationController';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAdmin, verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// GET /api/push/public-key - Obtener clave pública VAPID (público)
router.get('/public-key', PushNotificationController.getPublicKey);

// POST /api/push/subscribe - Suscribirse a notificaciones (autenticado)
router.post('/subscribe', verifyToken, verifyAuthenticated, PushNotificationController.subscribe);

// POST /api/push/unsubscribe - Cancelar suscripción (autenticado)
router.post('/unsubscribe', verifyToken, verifyAuthenticated, PushNotificationController.unsubscribe);

// POST /api/push/send-to-user - Enviar push a usuario específico (solo admin)
router.post('/send-to-user', verifyToken, verifyAdmin, PushNotificationController.sendToUser);

// POST /api/push/send-to-all - Enviar push a todos (solo admin)
router.post('/send-to-all', verifyToken, verifyAdmin, PushNotificationController.sendToAll);

export default router;
