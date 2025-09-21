import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyJwt } from "../utils/jwt";

export interface AuthPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  auth?: AuthPayload;
}


export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const parts = authHeader.split(" ");
  const token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : null;
  if (!token) {
    return res.status(401).json({ message: "Invalid authorization header" });
  }

  try {
    const payload = verifyJwt<AuthPayload>(token);
    
    (req as AuthRequest).auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

