import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Datos inválidos", details: error.flatten() });
  }

  const status = typeof error.status === "number" ? error.status : 500;
  const message = error.message || "Error interno del servidor";
  return res.status(status).json({ message });
};
