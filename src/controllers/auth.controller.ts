import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "../errors/AppError";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.register(
      req.body as { name: string; email: string; password: string },
    );
    sendSuccess(
      res,
      { user, ...tokens },
      StatusCodes.CREATED,
      "Registration successful",
    );
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await AuthService.login(
      req.body as { email: string; password: string },
    );
    sendSuccess(res, { user, ...tokens }, StatusCodes.OK, "Login successful");
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getMe(req.user?.id ?? "");
    sendSuccess(res, user);
  }),
  // auth.controller.ts
  googleLogin: asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body;
    console.log(idToken);
    if (!idToken) throw new ValidationError("Google token is required");
    const result = await AuthService.googleLogin(idToken);
    sendSuccess(res, result, 200, "Google login successful");
  }),
};
