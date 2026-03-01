import { Schema, model, Types } from "mongoose";
import { ITeam } from "../types/schema.types";

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: false,
      default: "",
      trim: true,
    },

    members: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate team names (optional but recommended)
teamSchema.index({ name: 1 }, { unique: true });

// Faster member lookup
teamSchema.index({ members: 1 });

export const TeamModel = model<ITeam>("Team", teamSchema);
