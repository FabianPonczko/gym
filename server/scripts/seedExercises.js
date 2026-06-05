import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "../models/Exercise.js";

dotenv.config();

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // 🧹 limpiar (opcional)
    await Exercise.deleteMany();

    // 💪 ejercicios base
    const exercises = [
      // 🟥 PECHO
      { name: "Press Banca", group: "chest" },
      { name: "Press Inclinado", group: "chest" },
      { name: "Cruces de Polea", group: "chest" },
      { name: "Aperturas", group: "chest" },

      
      // 🟦 ESPALDA
      { name: "Dominadas", group: "back" },
      { name: "Remo Barra", group: "back" },
      { name: "Remo Polea Baja", group: "back" },
      { name: "Remo al Pecho", group: "back" },
      { name: "Jalón al Pecho", group: "back" },

      // 🟩 PIERNAS
      { name: "Sentadilla", group: "legs" },
      { name: "Prensa", group: "legs" },
      { name: "Prensa de pierna 45°", group: "legs" },
      { name: "Peso muerto", group: "legs" },
      { name: "Gemelos en Prensa", group: "legs" },
      { name: "Gemelos Sentado", group: "legs" },
      { name: "Curl Femoral Sentado", group: "legs" },
      { name: "Curl Femoral Acostado", group: "legs" },
      { name: "Extensiones de Cuádriceps", group: "legs" },
      { name: "Abductores", group: "legs" },
      { name: "Crunch Abdominal en polea", group: "legs" },
      { name: "Peso Muerto Rumano", group: "legs" },
      { name: "Zancadas", group: "legs" },
      { name: "Plancha Frontal", group: "legs" },

      // 🟨 HOMBROS
      { name: "Press de Hombros", group: "shoulders" },
      { name: "Elevaciones laterales", group: "shoulders" },
      { name: "Pájaros", group: "shoulders" },
      { name: "Press Frances", group: "shoulders" },

      // 🟪 BRAZOS
      { name: "Curl Bíceps", group: "arms" },
      { name: "Martillo con Mancuernas", group: "arms" },
      { name: "Tríceps Polea", group: "arms" },
      { name: "Biceps con Mancuernas", group: "arms" },
      { name: "Fondos", group: "arms" },

      // ⚫ CORE
      { name: "Plancha", group: "core" },
      { name: "Crunch", group: "core" },
      { name: "Elevaciones piernas", group: "core" }
    ];

    await Exercise.insertMany(exercises);

    console.log("✅ Ejercicios cargados");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedExercises();