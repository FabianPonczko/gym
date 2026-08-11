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

// Lista de orígenes permitidos
const allowedOrigins = [
  "https://gym-client-mauve.vercel.app",  // URL real de tu frontend en producción
  "http://localhost:3000",                // React / Next.js local
  "http://localhost:5173"                 // Vite local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (como Postman o Server-to-Server)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Es mejor pasar el error al callback sin romper drásticamente el proceso interno
        callback(null, false); 
      }
    },
     credentials: true,
    optionsSuccessStatus: 204
  })
);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://gym-client-mauve.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return res.sendStatus(204);
});

// Mantén esta línea justo debajo
app.options("*", cors());

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
  
  // ... Todo tu código de rutas y mongoose

// LÍNEA OBLIGATORIA AL FINAL DEL ARCHIVO:
export default app;
