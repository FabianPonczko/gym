import mongoose from "mongoose";

const routineSchema = new mongoose.Schema({
  name: String,
  description: String,

  days: [
    {
      day: String,
      exercises: [
        {
          exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise"
          },
          sets: Number,
          reps: Number,
          weight: Number
        }
      ]
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

export default mongoose.model("Routine", routineSchema);