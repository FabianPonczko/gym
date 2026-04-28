import { useEffect, useState } from "react";
import api from "../services/api";
import "./dashboard.css";
import WeightModal from "../components/WeightModal";

export default function Dashboard() {
  const [routine, setRoutine] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await api.get("/users/my-routine");
        setRoutine(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRoutine();
  }, []);

  // 👉 abre el modal
  const abrirModal = (exercise) => {
    setSelectedExercise(exercise);
  };

  // 👉 guarda desde el modal
  const guardarPeso = async (data) => {
    try {
      await api.post("/progress", data);
      alert("Guardado 💪");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🏋️ Mi Rutina</h1>

      {routine ? (
        <>
          <h2 className="routine-name">{routine.name}</h2>

          <div className="grid">
            {routine.exercises.map((ex, i) => (
              <div className="card" key={i}>
                <h3>{ex.name}</h3>
                <p>{ex.sets} x {ex.reps}</p>

                <button onClick={() => abrirModal(ex.name)}>
                  Registrar peso
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Cargando rutina...</p>
      )}

      {/* 👉 MODAL */}
      {selectedExercise && (
        <WeightModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onSave={guardarPeso}
        />
      )}
    </div>
  );
}