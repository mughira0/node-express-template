import mongoose from "mongoose";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info(`[DB] MongoDB connected: ${env.MONGO_URI}`);
  } catch (error) {
    logger.error("[DB] Connection failed", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info("[DB] MongoDB disconnected");
}
