import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  group: String // chest, back, legs, shoulders, arms, core
});

export default mongoose.model("Exercise", exerciseSchema);