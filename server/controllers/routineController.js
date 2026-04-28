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

export const getRoutines = async (req, res) => {
  const routines = await Routine.find();
  res.json(routines);
};