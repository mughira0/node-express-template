import http from "http";
import { Application } from "express";
import { logger } from "./utils/logger";
import { env } from "./config/env";

export function createServer(app: Application): http.Server {
  const server = http.createServer(app);

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") throw error;

    switch (error.code) {
      case "EACCES":
        logger.error(`Port ${env.PORT} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        logger.error(`Port ${env.PORT} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  return server;
}
