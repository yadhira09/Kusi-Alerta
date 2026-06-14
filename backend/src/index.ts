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
const allowedOrigins = [
  frontendUrl,
  mobileUrl,
  "http://localhost:19006",
  "http://localhost:8081",
  "http://localhost:5173",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:5173",
  "http://192.168.18.53:8081",
  "http://192.168.18.53:5173"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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

initSocket(server, allowedOrigins);

server.listen(port, () => {
  console.log(`KusiAlerta API escuchando en http://localhost:${port}`);
});
