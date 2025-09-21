import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        username: string;
        role?: string; 
      };
    }
  }
}
