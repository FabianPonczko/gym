import Progress from "../models/Progress.js";
import Routine from "../models/Routine.js";
import User from "../models/User.js";

export const adjustRoutine = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json("No autorizado");
    }

    // 🔎 traer usuario + rutina
    const user = await User.findById(req.user.id).populate("routine");

    if (!user || !user.routine) {
      return res.status(404).json("Usuario sin rutina");
    }

    const { goal, level, daysPerWeek } = user;
    const routine = user.routine;

    const updatedExercises = [];

    for (let ex of routine.exercises) {
      // 📊 historial del ejercicio
      const history = await Progress.find({
        user: user._id,
        exercise: ex.name
      })
        .sort({ date: -1 })
        .limit(3);

      let newWeight = ex.weight || 10;
      let newReps = ex.reps;
      let newSets = ex.sets;

      // =========================
      // 🧠 1. PROGRESO REAL
      // =========================
      let improved = false;
      let fatigued = false;

      if (history.length > 0) {
        const avgReps =
          history.reduce((acc, h) => acc + h.reps, 0) / history.length;

        if (avgReps >= ex.reps) {
          improved = true;
        }

        if (avgReps < ex.reps - 3) {
          fatigued = true;
        }
      }
      if (improved) {
        newWeight += 2.5;
      }

      if (fatigued) {
        newWeight -= 2.5;
        newSets = Math.max(2, newSets - 1);
      }
      // =========================
      // 🎯 2. OBJETIVO
      // =========================
      if (goal === "strength") {
        newReps = 5;
         // SOLO si mejora
        if (improved) newWeight += 2.5;
      }

      if (goal === "hypertrophy") {
        newReps = 8 + Math.floor(Math.random() * 4); // 8-12
      }

      if (goal === "weight_loss") {
        newReps = 12;
        newSets += 1;
      }

      // =========================
      // 📊 3. NIVEL
      // =========================
      if (level === "beginner") {
        newSets = 3;
      }

      if (level === "intermediate") {
        newSets = 4;
      }

      if (level === "advanced") {
        newSets = 5;
      }

      // control de estancamiento:
      if (!improved && history.length >= 3) {
        // estancado → cambiar reps en vez de peso
        newReps += 1;
      }

      // =========================
      // 📅 4. FRECUENCIA
      // =========================
      if (daysPerWeek <= 3) {
        newSets += 1; // más volumen por día
      }

      if (daysPerWeek >= 5) {
        newSets = Math.max(2, newSets - 1); // menos volumen
      }

      // evitar valores negativos
      newWeight = Math.max(2.5, newWeight);
      newSets = Math.max(2, newSets);

      updatedExercises.push({
        ...ex._doc,
        weight: newWeight,
        reps: newReps,
        sets: newSets
      });
    }

    // 💾 guardar rutina
    routine.exercises = updatedExercises;
    await routine.save();

    res.json(routine);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error en IA");
  }
};