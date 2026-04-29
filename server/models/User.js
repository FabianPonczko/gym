import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
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
  }
});
export default mongoose.model("User", userSchema);