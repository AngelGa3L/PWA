import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import BiometricController from '../controllers/BiometricController';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/Validator';
import verifyToken from '../middlewares/VerifyToken';
import { verifyAuthenticated } from '../middlewares/VerifyRole';

const router = Router();

// Validaciones para login
const loginValidation = [
  body('email').isEmail().withMessage('Email válido es requerido'),
  body('password').notEmpty().withMessage('Contraseña es requerida'),
  handleValidationErrors
];

// Validaciones para verificar código 2FA
const verifyCodeValidation = [
  body('userId').isInt().withMessage('userId es requerido'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Código de 6 dígitos es requerido'),
  handleValidationErrors
];

// Validaciones para login biométrico
const biometricLoginValidation = [
  body('email').isEmail().withMessage('Email válido es requerido'),
  body('credential').notEmpty().withMessage('Credential es requerida'),
  handleValidationErrors
];

// POST /api/auth/login/initiate - Iniciar login (enviar código 2FA)
router.post('/login/initiate', loginValidation, AuthController.initiateLogin);

// POST /api/auth/login/verify - Verificar código 2FA y obtener token
router.post('/login/verify', verifyCodeValidation, AuthController.verifyCode);

// POST /api/auth/login - Login tradicional sin 2FA (mantener por compatibilidad)
router.post('/login', loginValidation, AuthController.login);

// POST /api/auth/biometric/login - Login con biometría
router.post('/biometric/login', biometricLoginValidation, BiometricController.loginWithBiometric);

// GET /api/auth/biometric/status - Obtener estado de biometría (autenticado)
router.get('/biometric/status', verifyToken, verifyAuthenticated, BiometricController.getBiometricStatus);

// POST /api/auth/biometric/enable - Habilitar biometría (autenticado)
router.post('/biometric/enable', verifyToken, verifyAuthenticated, BiometricController.enableBiometric);

// POST /api/auth/biometric/disable - Deshabilitar biometría (autenticado)
router.post('/biometric/disable', verifyToken, verifyAuthenticated, BiometricController.disableBiometric);

export default router;