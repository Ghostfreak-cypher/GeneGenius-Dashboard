import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

interface JWTPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId } as JWTPayload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
