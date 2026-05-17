import express from "express";
import {addProgress,getProgressByExercise,getUserProgress,getRecommendation,deleteProgress,deleteProgressByExercise} from "../controllers/progressController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addProgress);
router.get("/by-exercise", verifyToken, getProgressByExercise);
router.delete("/exercise/:exercise",verifyToken, deleteProgressByExercise);
router.get("/user/:userId", verifyToken, getUserProgress);
router.get("/recommendation", verifyToken, getRecommendation);
router.delete("/delete/:id", verifyToken, deleteProgress);
export default router;