import express from "express";
import { assignRoutine } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.put("/assign-routine", verifyToken, isAdmin, assignRoutine);
router.get("/my-routine", verifyToken, getMyRoutine);
export default router;