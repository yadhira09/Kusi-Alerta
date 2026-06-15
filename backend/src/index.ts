import "dotenv/config";
import http from "http";
import cors from "cors";
import express from "express";
import { apiRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { initSocket } from "./socket/socket";

const app = express();
const server = http.createServer(app);

const port = Number(process.env.PORT || 4000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const mobileUrl = process.env.MOBILE_URL || "http://localhost:8081";

const staticAllowedOrigins = new Set(
  [
    frontendUrl,
    mobileUrl,
    "http://localhost:19006",
    "http://localhost:8081",
    "http://localhost:5173",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:5173"
  ].filter(Boolean)
);

function isAllowedOrigin(origin?: string) {
  if (!origin) return true;

  try {
    const url = new URL(origin);

    return (
      staticAllowedOrigins.has(origin) ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname.endsWith(".app.github.dev") ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(url.hostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(url.hostname)
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true
  })
);

app.use(express.json());
app.use("/api", apiRouter);
app.use(errorHandler);

initSocket(server, isAllowedOrigin);

server.listen(port, "0.0.0.0", () => {
  console.log(`KusiAlerta API escuchando en http://0.0.0.0:${port}`);
});