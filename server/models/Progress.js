import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  exercise: String,
  weight: Number,
  reps: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Progress", progressSchema);