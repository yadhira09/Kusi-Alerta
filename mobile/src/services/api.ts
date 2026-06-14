import axios from "axios";
import { API_BASE_URL } from "./config";
import type { AlertDto, SerenoDto, UserDto } from "../types";

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

export async function getUsers() {
  const { data } = await api.get<UserDto[]>("/users");
  return data;
}

export async function getSerenos() {
  const { data } = await api.get<SerenoDto[]>("/serenos");
  return data;
}

export async function createAlert(payload: { citizenId?: string; type: string; reference: string; description?: string; evidenceText?: string }) {
  const { data } = await api.post<AlertDto>("/alerts", {
    citizenId: payload.citizenId,
    type: payload.type,
    description: payload.description,
    locationText: "Mercado Santa Rosa, Coronel Gregorio Albarracín Lanchipa, Tacna",
    reference: payload.reference,
    evidenceText: payload.evidenceText
  });
  return data;
}

export async function getAlert(alertId: string) {
  const { data } = await api.get<AlertDto>(`/alerts/${alertId}`);
  return data;
}

export async function getCitizenHistory(citizenId: string) {
  const { data } = await api.get<AlertDto[]>(`/alerts/citizen/${citizenId}/history`);
  return data;
}

export async function getAllAlerts() {
  const { data } = await api.get<AlertDto[]>("/alerts");
  return data;
}

export async function updateAlertStatus(alertId: string, status: "EN_DESPLIEGUE" | "EN_INTERVENCION") {
  const { data } = await api.patch<AlertDto>(`/alerts/${alertId}/status`, {
    status,
    responsibleName: "Luis Mamani",
    responsibleRole: "SERENO"
  });
  return data;
}

export async function closeAlert(alertId: string, payload: { activity: string; observations: string; recommendations: string; result: string }) {
  const { data } = await api.post<AlertDto>(`/alerts/${alertId}/close`, { ...payload, responsibleName: "Luis Mamani" });
  return data;
}

export async function rateAlert(alertId: string, payload: { stars: number; comment?: string }) {
  const { data } = await api.post(`/alerts/${alertId}/rating`, payload);
  return data;
}
