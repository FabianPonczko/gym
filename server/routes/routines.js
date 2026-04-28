import express from "express";
import { createRoutine, getRoutines } from "../controllers/routineController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createRoutine);
router.get("/", verifyToken, getRoutines);

export default router;