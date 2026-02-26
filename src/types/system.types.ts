import { Request, Response, NextFunction } from "express";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;
