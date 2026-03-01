import { Router } from "express";
import { TeamController } from "../controllers/teams.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.use(authenticate);
router.get("/admin/find/all", TeamController.getTeams);
router.post("/create", TeamController.createTeam);
router.patch("/update", TeamController.updateTeam);
router.get("/find/all", TeamController.getTeamsAsParticipant);
router.get("/find/my", TeamController.getMyTeams);

router.get("/:id", TeamController.getTeamById);
router.delete("/:id", TeamController.deleteTeam);

export default router;
