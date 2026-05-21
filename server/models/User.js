import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

  name: {

    type: String,

    unique: true,

    required: true
  },
 

  email: { type: String, unique: true },
  password: String,
  
  role: {
    type: String,
    enum: ["Admin", "coach", "client"],
    default: "client"
  },
  
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  routine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Routine"
  },

  routineExpiration: {
    type: Date
  },
  
  goal: {
  type: String,
  enum: ["strength", "hypertrophy", "weight_loss"],
  default: "hypertrophy"
},
level: {
  type: String,
  enum: ["beginner", "intermediate", "advanced"],
  default: "beginner"
},
daysPerWeek: {
  type: Number,
  default: 3
},
onboardingCompleted: {
  type: Boolean,
  default: false
}
});
export default mongoose.model("User", userSchema);