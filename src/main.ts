import { createApp } from "./app";
import { createServer } from "./server";
import { connectDB, disconnectDB } from "./db";
import { logger } from "./utils/logger";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = createApp();
  const server = createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`[Server] Running on port ${env.PORT}`);
  });

  async function shutdown(signal: string): Promise<void> {
    logger.info(`[Server] ${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  process.on("unhandledRejection", (reason: unknown) => {
    logger.error("[Server] Unhandled Rejection:", reason);
    process.exit(1);
  });

  process.on("uncaughtException", (error: Error) => {
    logger.error("[Server] Uncaught Exception:", error);
    process.exit(1);
  });
}

bootstrap().catch((err: unknown) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
