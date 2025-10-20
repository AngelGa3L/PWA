import { Router } from "express";
import UsersController from "../controllers/UsersController";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { handleValidationErrors } from "../middlewares/Validator";

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

router.get("/", UsersController.getAllUsers);
router.get("/:id", UsersController.getUserById);
router.post("/", userValidation, UsersController.createUser);
router.put("/:id", UsersController.updateUser);
router.delete("/:id", UsersController.deleteUser);
router.get("/:id/polls", UsersController.getUserPolls);
router.get("/:id/responses", UsersController.getUserResponses);

export default router;
