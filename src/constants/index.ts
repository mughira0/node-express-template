import { TProvider, TRole } from "../types/user.types";

export const ROLE = {
  USER: "user" as TRole,
  ADMIN: "admin" as TRole,
} as const;
export const ROLES: TRole[] = [ROLE.USER, ROLE.ADMIN];

export const PROVIDER = {
  GOOGLE: "google" as TProvider,
  LOCAL: "local" as TProvider,
};
export const PROVIDERS: TProvider[] = [PROVIDER.GOOGLE, PROVIDER.LOCAL];
