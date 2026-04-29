import express from "express";
import {addProgress,getProgressByExercise,getUserProgress} from "../controllers/progressController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addProgress);
router.get("/by-exercise", verifyToken, getProgressByExercise);
router.get("/user/:userId", verifyToken, getUserProgress);

export default router;