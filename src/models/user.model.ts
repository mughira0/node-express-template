import { Schema, model } from "mongoose";
import { PROVIDER, PROVIDERS, ROLES } from "../constants";
import { IUser } from "../types/user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      required: false,
      default: "",
    },
    provider: {
      type: String,
      enum: PROVIDERS,
      default: PROVIDER.LOCAL,
    },
    googleId: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<IUser>("User", userSchema);
