import { Platform } from "react-native";

const ENV_API_HOST = process.env.EXPO_PUBLIC_API_HOST;

function getWebApiHost() {
  if (typeof window === "undefined") {
    return "http://localhost:4000";
  }

  const { protocol, hostname } = window.location;

  if (hostname.endsWith(".app.github.dev")) {
    return `${protocol}//${hostname.replace("-8081.", "-4000.")}`;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4000";
  }

  return `http://${hostname}:4000`;
}

const LOCAL_HOST = Platform.select({
  android: ENV_API_HOST || "http://10.0.2.2:4000",
  ios: ENV_API_HOST || "http://localhost:4000",
  web: ENV_API_HOST || getWebApiHost(),
  default: ENV_API_HOST || "http://localhost:4000"
});

export const API_HOST = LOCAL_HOST;
export const API_BASE_URL = `${API_HOST}/api`;
export const SOCKET_URL = API_HOST;