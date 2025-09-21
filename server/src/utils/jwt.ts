import jwt, { Secret, SignOptions } from "jsonwebtoken";

const SECRET: Secret = process.env.JWT_SECRET || "dev_secret";

export function signJwt(
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, SECRET) as T;
}
