import express from "express";
import { createRoutine, getRoutines, getRoutineById, deleteRoutine} from "../controllers/routineController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { adjustRoutine } from "../controllers/routineAIController.js";

const router = express.Router();

// router.post("/", verifyToken, isAdmin, createRoutine);
router.get("/", verifyToken, getRoutines);
router.get("/:id",verifyToken, getRoutineById);
router.delete("/:id", deleteRoutine);
router.post("/", verifyToken, allowRoles("Admin", "coach"), createRoutine);
router.post("/adjust", verifyToken, adjustRoutine);

export default router;