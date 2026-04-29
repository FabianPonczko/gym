import express from "express";
import { createRoutine, getRoutines } from "../controllers/routineController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

// router.post("/", verifyToken, isAdmin, createRoutine);
router.get("/", verifyToken, getRoutines);
router.post("/", verifyToken, allowRoles("Admin", "coach"), createRoutine);
export default router;