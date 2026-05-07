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

//delete progress
export const deleteProgress = async (req, res) => {
  try {
    const userId= req.params.id;
    const progress = await Progress.deleteMany({
      user: userId,
    });

   res.json({
      message: "Progreso borrado con éxito",
    });

  } catch (err) {
     res.status(500).json({
      message: "Error borrando progreso",
    });
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

export const getRecommendation = async (req, res) => {
  const { exercise } = req.query;

  const history = await Progress.find({
    user: req.user.id,
    exercise
  })
    .sort({ date: -1 })
    .limit(3);

  if (history.length === 0) {
    return res.json({ message: "Sin datos", weight: 10 });
  }

  const last = history[0];

  let recommended = last.weight;

  let trend = "same";

  // 🧠 lógica simple
  if (last.reps >= 10) {
    recommended = last.weight + 2.5; // subir peso
    trend = "up";
  } else if (last.reps < 6) {
    recommended = last.weight - 2.5; // bajar
    trend = "down";
  }

  res.json({
    exercise,
    lastWeight: last.weight,
    lastReps: last.reps,
    recommended,
    trend
  });
};