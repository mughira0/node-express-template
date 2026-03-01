import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { TeamService } from "../services/teams.service";
import { PaginationOptions } from "../utils/query.helper";

export const TeamController = {
  getTeams: asyncHandler(async (_req: Request, res: Response) => {
    const { page, limit, search } = _req.query as PaginationOptions;
    const teams = await TeamService.getAllTeams({ page, limit, search });
    sendSuccess(res, teams);
  }),

  getTeamById: asyncHandler(async (req: Request, res: Response) => {
    const team = await TeamService.getTeamById(req.params["id"] ?? "");
    sendSuccess(res, team);
  }),

  createTeam: asyncHandler(async (req: Request, res: Response) => {
    const { name, members, description } = req.body;
    const createdBy = req.user?.id as string;
    const team = await TeamService.createTeam(
      name,
      createdBy,
      description,
      members || [],
    );
    sendSuccess(res, team, 201, "Team created");
  }),
  updateTeam: asyncHandler(async (req: Request, res: Response) => {
    const { name, id, members, description } = req.body;
    const createdBy = req.user?.id as string;
    const team = await TeamService.updateTeam(
      id,
      name,
      createdBy,
      description,
      members || [],
    );
    sendSuccess(res, team, 201, "Team updated");
  }),

  deleteTeam: asyncHandler(async (req: Request, res: Response) => {
    await TeamService.deleteTeam(req.params["id"] ?? "");
    sendSuccess(res, null, 200, "Team deactivated");
  }),
  getMyTeams: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search } = req.query as PaginationOptions;
    const teams = await TeamService.getMyTeams(req.user?.id ?? "", {
      page,
      limit,
      search,
    });
    sendSuccess(res, teams);
  }),
  getTeamsAsParticipant: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, search } = req.query as PaginationOptions;
    const teams = await TeamService.getTeamsAsParticipant(req.user?.id ?? "", {
      page,
      limit,
      search,
    });
    sendSuccess(res, teams);
  }),
};
