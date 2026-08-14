// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js";
// import routineRoutes from "./routes/routines.js";
// import progressRoutes from "./routes/progress.js";
// import userRoutes  from "./routes/users.js";
// import exerciseRoutes from "./routes/exerciseRoutes.js";


// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API funcionando 🚀");
// });

// app.use("/api/exercises", exerciseRoutes);

// app.use("/api/auth", authRoutes);


// app.use("/api/routines", routineRoutes);


// app.use("/api/progress", progressRoutes);


// app.use("/api/users", userRoutes);

// app.use("/api/progress", progressRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("Mongo conectado");
//     app.listen(5000, () => console.log("Server en puerto 5000"));
//   })
//   .catch(err => console.log(err));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import routineRoutes from "./routes/routines.js";
import progressRoutes from "./routes/progress.js";
import userRoutes  from "./routes/users.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para conectar a MongoDB de forma eficiente en Serverless
let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Falta la variable de entorno MONGO_URI en Vercel");
    }
    
    // Configuraciones recomendadas para Serverless
    mongoose.set('bufferCommands', false); // 👈 Desactiva el buffering global para evitar colas infinitas
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 7000, // 👈 Si la DB no responde en 5s, corta rápido en vez de colgar la función
    });
    
    isConnected = true;
    console.log("Mongo conectado");
  } catch (error) {
    console.error("Error al conectar a Mongo:", error);
    throw error;
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Error de conexión a la base de datos" });
  }
});

// Rutas
app.get("/", (req, res) => {
  res.send("API funcionando en Vercel 🚀");
});

app.use("/api/exercises", exerciseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/routines", routineRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/users", userRoutes);

// ❌ Se eliminó app.listen(5000) por completo

// OBLIGATORIO PARA VERCEL: Exportar la aplicación
export default app;
