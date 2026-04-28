import express from "express";
import { addProgress, getMyProgress } from "../controllers/progressController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addProgress);
router.get("/", verifyToken, getMyProgress);

export default router;