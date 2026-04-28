import { useState } from "react";
import "./modal.css";

export default function WeightModal({ exercise, onClose, onSave }) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

  const handleSubmit = () => {
    if (!weight || !reps) return;

    onSave({
      exercise,
      weight,
      reps
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{exercise}</h2>

        <input
          type="number"
          placeholder="Peso (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Guardar</button>
          <button className="cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}