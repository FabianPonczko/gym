import Progress from "../models/Progress.js";

// 👉 guardar progreso
export const addProgress = async (req, res) => {
  try {
    const progress = await Progress.create({
      user: req.user.id,
      exercise: req.body.exercise,
      weight: req.body.weight,
      reps: req.body.reps
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 👉 historial por ejercicio (para dashboard)
export const getProgressByExercise = async (req, res) => {
  const { exercise } = req.query;

  const data = await Progress.find({
    user: req.user.id,
    exercise
  })
    .sort({ date: -1 })
    .limit(5);

  res.json(data);
};

// 👉 progreso de un usuario (para coach)
export const getUserProgress = async (req, res) => {
  const { userId } = req.params;

  const data = await Progress.find({ user: userId }).sort({ date: -1 });

  res.json(data);
};