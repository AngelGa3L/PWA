import { Request, Response, NextFunction } from "express";

// Middleware para verificar que el usuario sea administrador
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ msg: "Usuario no autenticado" });
  }

  // roleId 1 = admin, 2 = user (ajusta según tu DB)
  if (user.roleId !== 1) {
    return res.status(403).json({ msg: "Acceso denegado. Solo administradores." });
  }

  next();
};

// Middleware para verificar que el usuario sea dueño del recurso o admin
export const verifyOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const user = res.locals.user;
  const resourceUserId = parseInt(req.params.id || req.params.userId);

  if (!user) {
    return res.status(401).json({ msg: "Usuario no autenticado" });
  }

  // Si es admin o es el mismo usuario
  if (user.roleId === 1 || user.id === resourceUserId) {
    next();
  } else {
    return res.status(403).json({ msg: "Acceso denegado" });
  }
};

// Middleware para verificar que el usuario esté autenticado (cualquier rol)
export const verifyAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ msg: "Usuario no autenticado" });
  }

  next();
};
