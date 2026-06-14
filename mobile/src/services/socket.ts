import { io } from "socket.io-client";
import { SOCKET_URL } from "./config";

export function createCitizenSocket(citizenId: string) {
  return io(SOCKET_URL, { transports: ["websocket"], query: { citizenId } });
}

export function createSerenoSocket(serenoId: string) {
  return io(SOCKET_URL, { transports: ["websocket"], query: { serenoId } });
}
