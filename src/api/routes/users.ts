import { Router } from "express";
import UsersController from "../controllers/UsersController";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidationErrors } from "../middlewares/Validator";

const router = Router();

const userValidation = [
  body("email").isEmail().withMessage("Formato de email inválido"),
  body("firstName").notEmpty().withMessage("El nombre es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido es obligatorio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  body("method_login")
    .notEmpty()
    .withMessage("El método de inicio de sesión es obligatorio"),
  handleValidationErrors,
];

// GET /api/users - Get all users
router.get("/", UsersController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", UsersController.getUserById);

// POST /api/users - Create new user
router.post("/", userValidation, UsersController.createUser);

// PUT /api/users/:id - Update user
router.put("/:id", UsersController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete("/:id", UsersController.deleteUser);

// GET /api/users/:id/polls - Get polls created by user
router.get("/:id/polls", UsersController.getUserPolls);

// GET /api/users/:id/responses - Get responses by user
router.get("/:id/responses", UsersController.getUserResponses);

export default router;
