import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, secretKey as string);
    res.locals.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token inválido" });
  }
};

export default verifyToken;
