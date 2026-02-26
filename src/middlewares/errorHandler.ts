import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../utils/logger";

interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error(err);

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      message: err.message,
      stack: err.stack,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  const response: ErrorResponse = {
    success: false,
    message: err.message ?? "Internal server error",
    stack: err.stack,
  };

  res.status(500).json(response);
}
