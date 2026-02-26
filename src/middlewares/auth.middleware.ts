import { Request, Response, NextFunction } from "express";
import { AuthService, TokenPayload } from "../services/auth.service";
import { UnauthorizedError, ForbiddenError } from "../errors/AppError";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("No token provided"));
  }

  try {
    req.user = AuthService.verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("You do not have permission to perform this action"),
      );
    }

    next();
  };
}
