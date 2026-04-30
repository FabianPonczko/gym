import express from "express";
import { assignRoutine ,getAllUser,getMyRoutine,getUsers} from "../controllers/userController.js";
import { verifyToken, isAdmin  } from "../middleware/auth.js";
import User from "../models/User.js";


const router = express.Router();

router.put("/assign-routine", verifyToken,  assignRoutine);
router.get("/my-routine", verifyToken, getMyRoutine);
  router.get("/", verifyToken, getAllUser);
// router.get("/", verifyToken, getUsers);

router.put("/onboarding", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.goal = req.body.goal;
  user.level = req.body.level;
  user.daysPerWeek = req.body.daysPerWeek;
  user.onboardingCompleted = true;

  await user.save();

  res.json(user);
});
export default router;