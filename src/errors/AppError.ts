import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, StatusCodes.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
