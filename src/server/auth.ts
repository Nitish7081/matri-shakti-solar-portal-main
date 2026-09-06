import jwt from "jsonwebtoken";
import { AdminModel, IAdmin } from "./models/Admin";
import { connectDB } from "./db";

const JWT_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  "matri-shakti-solar-secret-key-at-least-32-chars";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(admin: IAdmin): string {
  const payload: TokenPayload = {
    id: admin._id ? admin._id.toString() : (admin as unknown as { id: string }).id,
    email: admin.email,
    role: admin.role || "admin",
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((pair) => {
    const [name, ...rest] = pair.trim().split("=");
    if (name) {
      cookies[name] = decodeURIComponent(rest.join("="));
    }
  });
  return cookies;
}

export function createAuthCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
    7 * 24 * 60 * 60
  }${isProd ? "; Secure" : ""}`;
}

export function createClearAuthCookieHeader(): string {
  return "admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export async function getAuthenticatedAdmin(
  req: Request
): Promise<IAdmin | null> {
  await connectDB();

  let token = "";

  // 1. Check HTTP-only Cookie
  const cookieHeader = req.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  if (cookies.admin_token) {
    token = cookies.admin_token;
  }

  // 2. Check Authorization Bearer header
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || !payload.id) return null;

  try {
    const admin = await AdminModel.findById(payload.id);
    return admin;
  } catch {
    return null;
  }
}
