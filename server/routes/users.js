import express from "express";
import { assignRoutine ,getAllUser,getMyRoutine,getUsers} from "../controllers/userController.js";
import { verifyToken, isAdmin  } from "../middleware/auth.js";

const router = express.Router();

router.put("/assign-routine", verifyToken,  assignRoutine);
router.get("/my-routine", verifyToken, getMyRoutine);
  router.get("/", verifyToken, getAllUser);
// router.get("/", verifyToken, getUsers);


export default router;