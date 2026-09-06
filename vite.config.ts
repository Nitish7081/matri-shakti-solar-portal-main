import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin, ViteDevServer } from "vite";

function apiDevServerPlugin(): Plugin {
  return {
    name: "api-dev-server",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url.startsWith("/api/") || req.url === "/api")) {
          try {
            const protocol = req.socket.encrypted ? "https" : "http";
            const host = req.headers.host || "localhost:8080";
            const fullUrl = `${protocol}://${host}${req.url}`;

            const chunks: Buffer[] = [];
            req.on("data", (chunk: Buffer) => chunks.push(chunk));
            await new Promise((resolve) => req.on("end", resolve));
            const bodyBuffer = Buffer.concat(chunks);

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

            const method = req.method || "GET";
            const webReq = new Request(fullUrl, {
              method,
              headers,
              body: ["GET", "HEAD"].includes(method.toUpperCase())
                ? undefined
                : bodyBuffer,
            });

            // Dynamically import API handler in dev
            const { handleApiRequest } = await import("./src/server/api");
            const webRes = await handleApiRequest(webReq);

            res.statusCode = webRes.status;
            webRes.headers.forEach((val, key) => {
              if (key.toLowerCase() !== "set-cookie") {
                res.setHeader(key, val);
              }
            });

            if (typeof (webRes.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === "function") {
              const cookies = (webRes.headers as unknown as { getSetCookie: () => string[] }).getSetCookie();
              if (cookies.length > 0) {
                res.setHeader("set-cookie", cookies);
              }
            } else {
              const sc = webRes.headers.get("set-cookie");
              if (sc) res.setHeader("set-cookie", sc);
            }

            const arrayBuffer = await webRes.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            console.error("[Vite Dev API Error]:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                success: false,
                message: (err as Error).message || "Internal server error",
              })
            );
          }
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
  },
  vite: {
    resolve: {
      alias: [
        { find: /^punycode\/?$/, replacement: "punycode" },
      ],
    },
    plugins: [apiDevServerPlugin()],
  },
});
