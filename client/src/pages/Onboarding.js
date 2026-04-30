import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import "./onboarding.css";

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
    <div className="onboarding-container">
      <div className="onboarding-card">

        <h1>Configurá tu entrenamiento</h1>

        <label>Objetivo</label>
<div className="options-grid">
  {[
    { label: "Fuerza", value: "strength" },
    { label: "Hipertrofia", value: "hypertrophy" },
    { label: "Definir", value: "weight_loss" }
  ].map(opt => (
    <div
      key={opt.value}
      className={`option ${goal === opt.value ? "active" : ""}`}
      onClick={() => setGoal(opt.value)}
    >
      {opt.label}
    </div>
  ))}
</div>

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

        <button className="onboarding-btn" onClick={handleSave}>
           Guardar y comenzar 🚀
        </button>

      </div>
    </div>
  );
}