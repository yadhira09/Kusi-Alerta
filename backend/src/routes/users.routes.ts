import { Router } from "express";
import { prisma } from "../prisma";

export const usersRouter = Router();

usersRouter.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/serenos", async (_req, res, next) => {
  try {
    const serenos = await prisma.sereno.findMany({ orderBy: { name: "asc" }, include: { user: true } });
    res.json(serenos);
  } catch (error) {
    next(error);
  }
});
