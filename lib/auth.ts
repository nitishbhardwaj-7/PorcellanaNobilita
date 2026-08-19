import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "nobilita_super_secret_jwt_signing_key_2026_secured";
const key = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromRequest(request: Request): Promise<JWTPayload | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenCookie = cookieHeader
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith("token="));

    if (!tokenCookie) {
      // Check Authorization header fallback
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        return await verifyToken(token);
      }
      return null;
    }

    const token = tokenCookie.substring(6); // Remove 'token='
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}
