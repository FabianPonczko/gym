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

  <div className="modal-overlayPeso">

    <div className="modalPeso">

      <h2>{exercise}:</h2>

      <form
        onSubmit={(e) => {

          e.preventDefault();

          handleSubmit();
        }}
      >

        <input
          type="number"
          placeholder="Peso"
          value={weight}
          onChange={(e) =>
            setWeight(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) =>
            setReps(e.target.value)
          }
        />

        <div className="modal-buttons">

          <button type="submit">
            Guardar
          </button>

          <button
            type="button"
            className="cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

        </div>

      </form>

    </div>

  </div>
);
}

