import express, { Application } from "express";
import { requestLogger } from "./middlewares/requestLogger";
import { notFoundHandler } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";

export function createApp(): Application {
  const app = express();

  // ── Body parsers ──────────────────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ── Request logging ───────────────────────────────────────────────────────
  app.use(requestLogger);

  // ── Health check ──────────────────────────────────────────────────────────
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── API routes ────────────────────────────────────────────────────────────
  app.use("/api/v1", routes);

  // ── 404 handler ───────────────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ── Global error handler ──────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
