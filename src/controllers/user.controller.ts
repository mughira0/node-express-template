// ---------------------------------------------------------------------------
// Controller layer — HTTP in / HTTP out only. Zero business logic.
// ---------------------------------------------------------------------------

import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const UserController = {
  getUsers: asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    sendSuccess(res, users);
  }),

  getUserById: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params["id"] ?? "");
    sendSuccess(res, user);
  }),

  createUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.createUser(
      req.body as {
        name: string;
        email: string;
        password: string;
        role?: "user" | "admin";
      },
    );
    sendSuccess(res, user, 201, "User created");
  }),

  updateUser: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.updateUser(
      req.params["id"] ?? "",
      req.body as {
        name?: string;
        email?: string;
        isActive?: boolean;
        role?: "user" | "admin";
      },
    );
    sendSuccess(res, user, 200, "User updated");
  }),

  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteUser(req.params["id"] ?? "");
    sendSuccess(res, null, 200, "User deactivated");
  }),
};
