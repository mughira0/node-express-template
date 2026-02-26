import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.register(
      req.body as { name: string; email: string; password: string },
    );
    sendSuccess(res, { user, ...tokens }, 201, "Registration successful");
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.login(
      req.body as { email: string; password: string },
    );
    sendSuccess(res, { user, ...tokens }, 200, "Login successful");
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getMe(req.user?.id ?? "");
    sendSuccess(res, user);
  }),
};
