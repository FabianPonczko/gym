import Exercise from "../models/Exercise.js";

// 📥 CREAR EJERCICIO
export const createExercise = async (req, res) => {
  try {
    const { name, group } = req.body;

    if (!name || !group) {
      return res.status(400).json("Faltan datos");
    }

    const exists = await Exercise.findOne({ name });

    if (exists) {
      return res.status(400).json("Ya existe");
    }

    const exercise = new Exercise({
      name,
      group
    });

    await exercise.save();

    res.json(exercise);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error creando ejercicio");
  }
};


// 📋 LISTAR EJERCICIOS
export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ group: 1 });
    res.json(exercises);
  } catch (err) {
    res.status(500).json("Error");
  }
};


// ❌ BORRAR
export const deleteExercise = async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json("Eliminado");
  } catch (err) {
    res.status(500).json("Error");
  }
};