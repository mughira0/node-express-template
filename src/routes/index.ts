import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import teamRoutes from "./teams.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teams", teamRoutes);

export default router;
