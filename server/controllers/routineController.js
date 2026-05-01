import Routine from "../models/Routine.js";

export const createRoutine = async (req, res) => {
  try {
    const routine = await Routine.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.json(routine);
  } catch (err) {
    res.status(500).json(err);
  }
};

// export const getRoutines = async (req, res) => {
//   const routines = await Routine.find();
//   res.json(routines);
// };

export const getRoutines = async (req, res) => {
  const routines = await Routine.find().populate(
    "days.exercises.exercise"
  );

  res.json(routines);
};

export const getRoutineById = async (req, res) => {
  try {
    const routine = await Routine.findById(req.params.id).populate(
      "days.exercises.exercise"
    );

    if (!routine) {
      return res.status(404).json("Rutina no encontrada");
    }

    res.json(routine);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error al obtener rutina");
  }
};
import User from "../models/User.js";

export const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findByIdAndDelete(req.params.id);

    if (!routine) {
      return res.status(404).json("Rutina no encontrada");
    }

    // 🔥 quitar rutina a usuarios
    await User.updateMany(
      { routine: req.params.id },
      { $unset: { routine: "" } }
    );

    res.json({ message: "Rutina eliminada ✅" });

  } catch (err) {
    res.status(500).json("Error al eliminar rutina");
  }
};