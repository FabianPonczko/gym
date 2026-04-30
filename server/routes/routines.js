import express from "express";
import { createRoutine, getRoutines } from "../controllers/routineController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { adjustRoutine } from "../controllers/routineAIController.js";

const router = express.Router();

// router.post("/", verifyToken, isAdmin, createRoutine);
router.get("/", verifyToken, getRoutines);
router.post("/", verifyToken, allowRoles("Admin", "coach"), createRoutine);
router.post("/adjust", verifyToken, adjustRoutine);

export default router;