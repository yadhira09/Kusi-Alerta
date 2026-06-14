import type { AlertDto } from "./index";

export type RootStackParamList = {
  RoleSelector: undefined;
  CitizenHome: undefined;
  CreateAlert: { prefillType?: string } | undefined;
  CitizenTracking: { alertId: string; citizenId: string };
  CitizenHistory: undefined;
  Rating: { alertId: string; citizenId: string };
  SerenoHome: undefined;
  SerenoAlertDetail: { alertId: string; serenoId: string };
  CloseCase: { alert: AlertDto; serenoId: string };
  Checklist: undefined;
};
