import express, { Request as ExpressReq, Response as ExpressRes } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { handleApiRequest } from "./api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed CORS origins for frontend and admin panels
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:8080,http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:8081")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to ensure smooth local testing
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Bridge Express req/res to Web Standards Request/Response for handleApiRequest
app.all("/api/*", async (req: ExpressReq, res: ExpressRes) => {
  try {
    const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const host = req.headers.host || `localhost:${PORT}`;
    const fullUrl = `${protocol}://${host}${req.originalUrl}`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }

    const method = req.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);

    let bodyPayload: string | undefined;
    if (hasBody) {
      bodyPayload = typeof req.body === "object" ? JSON.stringify(req.body) : req.body;
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }
    }

    const webReq = new Request(fullUrl, {
      method,
      headers,
      body: bodyPayload,
    });

    const webRes = await handleApiRequest(webReq);

    res.status(webRes.status);
    webRes.headers.forEach((val, key) => {
      if (key.toLowerCase() !== "set-cookie") {
        res.setHeader(key, val);
      }
    });

    // Handle cookies
    if (typeof (webRes.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function") {
      const cookies = (webRes.headers as unknown as { getSetCookie: () => string[] }).getSetCookie();
      if (cookies.length > 0) {
        res.setHeader("set-cookie", cookies);
      }
    } else {
      const sc = webRes.headers.get("set-cookie");
      if (sc) res.setHeader("set-cookie", sc);
    }

    const data = await webRes.text();
    res.send(data);
  } catch (err) {
    console.error("[Backend API Error]:", err);
    res.status(500).json({
      success: false,
      message: (err as Error).message || "Internal Server Error",
    });
  }
});

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Matri Shakti Backend API Server is running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/health`);
    console.log(`=================================================`);
  });

  try {
    console.log("[Backend] Connecting to MongoDB...");
    await connectDB();
  } catch (err) {
    console.error("[Backend DB Init Warning]:", (err as Error).message);
    console.log("[Backend] API server will remain running to handle incoming requests.");
  }
}

startServer();
