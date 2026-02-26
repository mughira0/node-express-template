import winston from "winston";
import { env } from "../config/env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${String(ts)} [${level}]: ${String(stack ?? message)}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    logFormat,
  ),
  transports: [new winston.transports.Console()],
});
