export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: TRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  photo?: string;
}

export type TRole = "user" | "admin";
