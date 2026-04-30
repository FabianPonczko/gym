import express from "express";
import {addProgress,getProgressByExercise,getUserProgress,getRecommendation} from "../controllers/progressController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addProgress);
router.get("/by-exercise", verifyToken, getProgressByExercise);
router.get("/user/:userId", verifyToken, getUserProgress);
router.get("/recommendation", verifyToken, getRecommendation);

export default router;