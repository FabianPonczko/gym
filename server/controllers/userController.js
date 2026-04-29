import User from "../models/User.js";

export const assignRoutine = async (req, res) => {
  try {
    const { userId, routineId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { routine: routineId },
      { new: true }
    ).populate("routine");

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getMyRoutine = async (req, res) => {
  const user = await User.findById(req.user.id).populate("routine");
  res.json(user.routine);
};

export const getAllUser = async (req, res) => {
  const user = await User.find().populate("routine")
  res.json(user);
};