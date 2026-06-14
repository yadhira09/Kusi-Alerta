import axios from "axios";
import type { AlertDto, DashboardSummaryDto, SerenoDto, UserDto } from "../types";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export async function getUsers() {
  const { data } = await api.get<UserDto[]>("/users");
  return data;
}

export async function getSerenos() {
  const { data } = await api.get<SerenoDto[]>("/serenos");
  return data;
}

export async function getAlerts(params?: { status?: string; priority?: string; search?: string }) {
  const { data } = await api.get<AlertDto[]>("/alerts", { params });
  return data;
}

export async function getAlert(id: string) {
  const { data } = await api.get<AlertDto>(`/alerts/${id}`);
  return data;
}

export async function receiveAlert(id: string) {
  const { data } = await api.patch<AlertDto>(`/alerts/${id}/receive`, { responsibleName: "Carmen Flores" });
  return data;
}

export async function assignAlert(id: string, serenoId: string) {
  const { data } = await api.patch<AlertDto>(`/alerts/${id}/assign`, { serenoId, responsibleName: "Carmen Flores" });
  return data;
}

export async function rejectAlert(id: string, reason: string) {
  const { data } = await api.patch<AlertDto>(`/alerts/${id}/reject`, { reason, responsibleName: "Carmen Flores" });
  return data;
}

export async function getDashboardSummary() {
  const { data } = await api.get<DashboardSummaryDto>("/dashboard/summary");
  return data;
}
