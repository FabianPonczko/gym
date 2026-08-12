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

// 1. Lista de orígenes permitidos
const allowedOrigins = [
  "https://gym-client-mauve.vercel.app",  
  "http://localhost:3000",                
  "http://localhost:5173"                 
];

// 2. Configuración limpia de CORS (Express maneja OPTIONS automáticamente aquí)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS")); 
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["X-CSRF-Token", "X-Requested-With", "Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Api-Version", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200 // Responde con HTTP 200 OK a las peticiones preflight del navegador
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
  
  // ... Todo tu código de rutas y mongoose

// LÍNEA OBLIGATORIA AL FINAL DEL ARCHIVO:
export default app;
