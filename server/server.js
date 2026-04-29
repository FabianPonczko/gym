import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import routineRoutes from "./routes/routines.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.use("/api/auth", authRoutes);


app.use("/api/routines", routineRoutes);


app.use("/api/progress", progressRoutes);


app.use("/api/users", userRoutes);

app.use("/api/progress", progressRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo conectado");
    app.listen(5000, () => console.log("Server en puerto 5000"));
  })
  .catch(err => console.log(err));