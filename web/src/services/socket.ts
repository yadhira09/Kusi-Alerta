import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export function createPanelSocket(role: "operator" | "admin") {
  return io(SOCKET_URL, {
    transports: ["websocket"],
    query: { role }
  });
}
