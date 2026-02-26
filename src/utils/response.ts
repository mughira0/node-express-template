import { Response } from "express";
import { ApiResponse } from "../types/system.types";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
): void {
  const response: ApiResponse<T> = { success: true, data, message };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: string[],
): void {
  const response: ApiResponse<null> = { success: false, message, errors };
  res.status(statusCode).json(response);
}
