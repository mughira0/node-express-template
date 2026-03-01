import { Types } from "mongoose";
import { NotFoundError } from "../errors/AppError";

import { TeamModel } from "../models/team.model";
import { ITeam } from "../types/schema.types";
import { paginateAndSearch } from "../utils/query.helper";

interface TeamQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export const TeamService = {
  async getAllTeams(options: TeamQueryOptions = {}): Promise<{
    results: ITeam[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  }> {
    const { page, limit, search } = options;
    console.log("TeamService.getAllTeams", page, limit, search);

    return paginateAndSearch<ITeam>(
      TeamModel,
      { isActive: true },
      {
        page,
        limit,
        search,
        searchFields: ["name", "description"],
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    ).then(async (obj) => {
      const populatedResults = await TeamModel.populate(obj.results, [
        { path: "members", select: "name email photo _id" },
        { path: "createdBy", select: "name email _id" },
      ]);

      return { ...obj, data: populatedResults };
    });
  },
  async getTeamById(id: string): Promise<ITeam> {
    const team = await TeamModel.findById(id)
      .populate("members", "name email photo")
      .populate("createdBy", "name email")
      .select("-__v");

    if (!team) throw new NotFoundError("Team");
    return team;
  },

  async createTeam(
    name: string,
    createdBy: string,
    description: string,
    members: string[],
  ): Promise<ITeam> {
    if (!members.includes(createdBy)) {
      members.push(createdBy);
    }

    const team = new TeamModel({
      name,
      members: members.map((m) => new Types.ObjectId(m)),
      createdBy: new Types.ObjectId(createdBy),
      description,
    });

    await team.save();

    await team.populate([
      { path: "members", select: "name email photo" },
      { path: "createdBy", select: "name email" },
    ]);

    return team;
  },
  async updateTeam(
    id: string,
    name: string,
    createdBy: string,
    description: string,
    members: string[],
  ): Promise<ITeam> {
    if (!members.includes(createdBy)) {
      members.push(createdBy);
    }

    const teamPrev = await this.findSingleTeam(id);
    if (!teamPrev) throw new NotFoundError("Team not found");
    const team = await TeamModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        members: members.map((m) => new Types.ObjectId(m)),
        createdBy,
      },
      { new: true },
    );

    if (!team) throw new NotFoundError("Team not found");
    await team.save();
    await team.populate([
      { path: "members", select: "name email photo" },
      { path: "createdBy", select: "name email" },
    ]);

    return team;
  },

  async findSingleTeam(teamId: string): Promise<ITeam> {
    const team = await TeamModel.findById(teamId)
      .populate("members", "name email photo")
      .populate("createdBy", "name email")
      .select("-__v");

    if (!team) throw new NotFoundError("Team");
    return team;
  },

  async deleteTeam(teamId: string): Promise<void> {
    const team = await TeamModel.findByIdAndUpdate(
      teamId,
      { $set: { isActive: false } },
      { new: true },
    );
    console.log("Tema delete", team);

    if (!team) throw new NotFoundError("Team");
  },

  // Add to TeamService object:

  async getMyTeams(
    userId: string,
    options: TeamQueryOptions = {},
  ): Promise<{
    results: ITeam[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  }> {
    const { page, limit, search } = options;

    return paginateAndSearch<ITeam>(
      TeamModel,
      { isActive: true, createdBy: new Types.ObjectId(userId) },
      {
        page,
        limit,
        search,
        searchFields: ["name", "description"],
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    ).then(async (obj) => {
      const populatedResults = await TeamModel.populate(obj.results, [
        { path: "members", select: "name email photo _id" },
        { path: "createdBy", select: "name email _id" },
      ]);

      return { ...obj, results: populatedResults };
    });
  },

  async getTeamsAsParticipant(
    userId: string,
    options: TeamQueryOptions = {},
  ): Promise<{
    results: ITeam[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  }> {
    const { page, limit, search } = options;

    return paginateAndSearch<ITeam>(
      TeamModel,
      {
        isActive: true,
        members: new Types.ObjectId(userId),
        createdBy: { $ne: new Types.ObjectId(userId) },
      },
      {
        page,
        limit,
        search,
        searchFields: ["name", "description"],
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    ).then(async (obj) => {
      const populatedResults = await TeamModel.populate(obj.results, [
        { path: "members", select: "name email photo _id" },
        { path: "createdBy", select: "name email _id" },
      ]);

      return { ...obj, results: populatedResults };
    });
  },
};
