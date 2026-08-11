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
  "https://vercel.app", // Producción
  "http://localhost:3000",                // React / Next.js local (ajusta el puerto si usas otro como 5173 para Vite)
  "http://localhost:5173"                 // Por si usas Vite en el frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origen (como herramientas de Postman o peticiones del mismo servidor)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado por políticas de CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
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
