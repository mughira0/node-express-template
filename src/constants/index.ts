import { TRole } from "../types/user.types";

export const ROLES: TRole[] = ["user", "admin"] as const;
export const ROLE = {
  USER: "user" as TRole,
  ADMIN: "admin" as TRole,
} as const;
