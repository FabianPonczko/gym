import express from "express";
import { assignRoutine ,getAllUser,getMyRoutine,getUsers} from "../controllers/userController.js";
import { verifyToken, isAdmin  } from "../middleware/auth.js";
import User from "../models/User.js";


const router = express.Router();

router.put("/assign-routine", verifyToken,  assignRoutine);
router.get("/my-routine", verifyToken, getMyRoutine);
router.get("/", verifyToken, getAllUser);

router.get("/me", verifyToken, async (req, res) => {
  try {
    console.log("Usuario autenticado:", req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No hay ID de usuario en el token" });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado en la base de datos" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error en GET /me:", error);
    res.status(500).json({ message: "Error interno al obtener el usuario", error: error.message });
  }
});

// RUTA /onboarding CORREGIDA
router.put("/onboarding", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.goal = req.body.goal;
    user.level = req.body.level;
    user.daysPerWeek = req.body.daysPerWeek;
    user.onboardingCompleted = true;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error en PUT /onboarding:", error);
    res.status(500).json({ message: "Error al guardar el onboarding", error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json("Error al eliminar");
  }
});

export default router;