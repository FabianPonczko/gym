import express from "express";
import {
  createExercise,
  getExercises,
  deleteExercise
} from "../controllers/exerciseController.js";

// import auth from "../middleware/auth.js";

const router = express.Router();

// 🔐 podés proteger con admin/coach si querés
router.post("/", createExercise);
router.get("/",  getExercises);
router.delete("/:id", deleteExercise);

export default router;