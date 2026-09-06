import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

const services = [
  {
    name: "BACKEND",
    cwd: path.join(rootDir, "backend"),
    args: ["run", "dev"],
    color: "\x1b[34m", // Blue
  },
  {
    name: "FRONTEND",
    cwd: path.join(rootDir, "frontend"),
    args: ["run", "dev"],
    color: "\x1b[32m", // Green
  },
  {
    name: "ADMIN",
    cwd: path.join(rootDir, "admin"),
    args: ["run", "dev"],
    color: "\x1b[35m", // Magenta
  },
];

const RESET = "\x1b[0m";
const children = [];

console.log("\x1b[1m\x1b[36m%s\x1b[0m", "=========================================================");
console.log("\x1b[1m\x1b[36m%s\x1b[0m", " ☀️  STARTING MATRI SHAKTI SOLAR PORTAL (3 SERVICES)  ☀️ ");
console.log("\x1b[1m\x1b[36m%s\x1b[0m", "=========================================================");
console.log("  📡 [BACKEND]  API Server      -> http://localhost:5000");
console.log("  🌐 [FRONTEND] Customer Portal -> http://localhost:8080");
console.log("  🛡️  [ADMIN]    Dedicated CRM   -> http://localhost:5174");
console.log("=========================================================\n");

for (const s of services) {
  const child = spawn(npmCmd, s.args, {
    cwd: s.cwd,
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
  });

  children.push(child);

  child.stdout?.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${s.color}[${s.name}]${RESET} ${line}`);
      }
    }
  });

  child.stderr?.on("data", (data) => {
    const lines = data.toString().split("\n");
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${s.color}[${s.name}]${RESET} \x1b[31m${line}\x1b[0m`);
      }
    }
  });

  child.on("close", (code) => {
    console.log(`${s.color}[${s.name}]${RESET} process exited with code ${code}`);
  });
}

function shutdown() {
  console.log("\nStopping all services...");
  for (const child of children) {
    if (child.pid) {
      try {
        if (isWin) {
          spawn("taskkill", ["/pid", child.pid.toString(), "/f", "/t"]);
        } else {
          child.kill("SIGTERM");
        }
      } catch {
        // ignore
      }
    }
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
