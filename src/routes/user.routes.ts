import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { ROLE } from "../constants";

const router = Router();

// All user routes require a valid JWT
router.use(authenticate);

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUserById);
router.post("/", authorize(ROLE.ADMIN), UserController.createUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", authorize(ROLE.ADMIN), UserController.deleteUser);

export default router;
