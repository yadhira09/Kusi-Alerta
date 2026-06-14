import { Router } from "express";
import { alertsRouter } from "./alerts.routes";
import { dashboardRouter } from "./dashboard.routes";
import { usersRouter } from "./users.routes";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "KusiAlerta API", timestamp: new Date().toISOString() });
});

apiRouter.use(usersRouter);
apiRouter.use(alertsRouter);
apiRouter.use(dashboardRouter);
