import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/Validator';

const router = Router();

// Validaciones para login
const loginValidation = [
  body('email').isEmail().withMessage('Email válido es requerido'),
  body('password').notEmpty().withMessage('Contraseña es requerida'),
  handleValidationErrors
];

router.post('/login', loginValidation, AuthController.login);


export default router;