import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  routine: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Routine"
}
});

export default mongoose.model("User", userSchema);