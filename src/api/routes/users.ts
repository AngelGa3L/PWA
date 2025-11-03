import { Router } from "express";
import UsersController from "../controllers/UsersController";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidationErrors } from "../middlewares/Validator";
import verifyToken from "../middlewares/VerifyToken";
import { verifyAdmin, verifyOwnerOrAdmin } from "../middlewares/VerifyRole";

const router = Router();

const userValidation = [
  body("email")
    .isEmail()
    .withMessage("Formato de email inválido")
    .notEmpty()
    .withMessage("El email es obligatorio"),
  body("firstName").notEmpty().withMessage("El nombre es obligatorio"),
  body("lastName").notEmpty().withMessage("El apellido es obligatorio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/
    )
    .withMessage(
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
    )
    .withMessage(
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
    ),
    body("roleId")
      .isInt()
      .withMessage("El ID de rol debe ser un número entero")
      .notEmpty()
      .withMessage("El ID de rol es obligatorio"),
  handleValidationErrors,
];

// Todas las rutas requieren autenticación
router.get("/", verifyToken, verifyAdmin, UsersController.getAllUsers);
router.get("/:id", verifyToken, verifyOwnerOrAdmin, UsersController.getUserById);
router.post("/", verifyToken, verifyAdmin, userValidation, UsersController.createUser);
router.put("/:id", verifyToken, verifyOwnerOrAdmin, UsersController.updateUser);
router.delete("/:id", verifyToken, verifyAdmin, UsersController.deleteUser);
router.get("/:id/polls", verifyToken, verifyOwnerOrAdmin, UsersController.getUserPolls);
router.get("/:id/responses", verifyToken, verifyOwnerOrAdmin, UsersController.getUserResponses);

export default router;
