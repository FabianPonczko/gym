import Progress from "../models/Progress.js";

export const addProgress = async (req, res) => {
  try {
    const progress = await Progress.create({
      user: req.user.id,
      ...req.body
    });

    res.json(progress);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getMyProgress = async (req, res) => {
  const data = await Progress.findById(req.user.id);
  res.json(data);
};