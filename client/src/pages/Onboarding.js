import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import "./login.css";

export default function Onboarding() {
  const [goal, setGoal] = useState("hypertrophy");
  const [level, setLevel] = useState("beginner");
  const [days, setDays] = useState(3);

  const navigate = useNavigate();

  const handleSave = async () => {
    await api.put("/users/onboarding", {
      goal,
      level,
      daysPerWeek: days
    });

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Configurá tu entrenamiento</h1>

        <label>Objetivo</label>
        <select onChange={(e) => setGoal(e.target.value)}>
          <option value="strength">Fuerza</option>
          <option value="hypertrophy">Hipertrofia</option>
          <option value="weight_loss">Bajar peso</option>
        </select>

        <label>Nivel</label>
        <select onChange={(e) => setLevel(e.target.value)}>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>

        <label>Días por semana</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <button onClick={handleSave}>
          Guardar y comenzar 🚀
        </button>

      </div>
    </div>
  );
}