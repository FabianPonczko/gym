import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import routineRoutes from "../routes/routines.js";
import progressRoutes from "../routes/progress.js";
import userRoutes  from "../routes/users.js";
import exerciseRoutes from "../routes/exerciseRoutes.js";


dotenv.config();

const app = express();


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.use("/api/exercises", exerciseRoutes);

app.use("/api/auth", authRoutes);


app.use("/api/routines", routineRoutes);


app.use("/api/progress", progressRoutes);


app.use("/api/users", userRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo conectado");
  })
  .catch(err => console.log(err));
  
  