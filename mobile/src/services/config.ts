import { Platform } from "react-native";

const LAN_HOST = "https://bug-free-xylophone-wrxwp9x76vxvc5w7v-8081.app.github.dev/";

export const API_HOST = Platform.select({
  android: LAN_HOST,
  ios: LAN_HOST,
  web: LAN_HOST,
  default: LAN_HOST
});

export const API_BASE_URL = `${API_HOST}/api`;
export const SOCKET_URL = API_HOST;