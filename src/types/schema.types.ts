import { Document, Schema, Types } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: TRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  provider: TProvider;
  photo?: string;
  googleId?: string;
}

export type TRole = "user" | "admin";
export type TProvider = "google" | "local";

export interface ITeam extends Document {
  name: string;
  description?: string;
  members: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
