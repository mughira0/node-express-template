import { Schema, model } from "mongoose";
import { ROLES } from "../constants";
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
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never returned in queries by default
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
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<IUser>("User", userSchema);
