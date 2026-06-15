import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

type OriginValidator = (origin?: string) => boolean;

export function initSocket(server: HttpServer, isAllowedOrigin: OriginValidator) {
  io = new Server(server, {
    cors: {
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origen no permitido por Socket.IO: ${origin}`), false);
      },
      methods: ["GET", "POST", "PATCH"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    const role = String(socket.handshake.query.role ?? "");
    const citizenId = String(socket.handshake.query.citizenId ?? "");
    const serenoId = String(socket.handshake.query.serenoId ?? "");

    if (role === "operator") socket.join("operators");
    if (role === "admin") socket.join("admins");
    if (citizenId) socket.join(`citizen:${citizenId}`);
    if (serenoId) socket.join(`sereno:${serenoId}`);

    socket.emit("connected", {
      ok: true,
      rooms: Array.from(socket.rooms)
    });
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.IO no inicializado");
  }

  return io;
}

export function emitAlertEvent(
  eventName: string,
  alert: {
    citizenId: string;
    assignedSerenoId?: string | null;
  }
) {
  const socketServer = getIo();

  socketServer.to("operators").emit(eventName, alert);
  socketServer.to("admins").emit(eventName, alert);
  socketServer.to(`citizen:${alert.citizenId}`).emit(eventName, alert);

  if (alert.assignedSerenoId) {
    socketServer.to(`sereno:${alert.assignedSerenoId}`).emit(eventName, alert);
  }

  socketServer.to("operators").emit("alert_updated", alert);
  socketServer.to("admins").emit("alert_updated", alert);
  socketServer.to(`citizen:${alert.citizenId}`).emit("alert_updated", alert);

  if (alert.assignedSerenoId) {
    socketServer.to(`sereno:${alert.assignedSerenoId}`).emit("alert_updated", alert);
  }
}