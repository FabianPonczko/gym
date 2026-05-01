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
      { name: "Press banca", group: "chest" },
      { name: "Press inclinado", group: "chest" },
      { name: "Aperturas", group: "chest" },

      // 🟦 ESPALDA
      { name: "Dominadas", group: "back" },
      { name: "Remo barra", group: "back" },
      { name: "Jalón al pecho", group: "back" },

      // 🟩 PIERNAS
      { name: "Sentadilla", group: "legs" },
      { name: "Prensa", group: "legs" },
      { name: "Peso muerto", group: "legs" },
      { name: "Gemelos", group: "legs" },

      // 🟨 HOMBROS
      { name: "Press militar", group: "shoulders" },
      { name: "Elevaciones laterales", group: "shoulders" },
      { name: "Pájaros", group: "shoulders" },

      // 🟪 BRAZOS
      { name: "Curl bíceps", group: "arms" },
      { name: "Tríceps polea", group: "arms" },
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