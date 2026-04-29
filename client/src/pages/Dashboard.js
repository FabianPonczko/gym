import { useEffect, useState } from "react";
import api from "./services/api";
import "./dashboard.css";
import WeightModal from "../components/WeightModal";
import Layout from "../components/Layout"

export default function Dashboard() {
  const [routine, setRoutine] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
 const [history, setHistory] = useState({}); 

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

  const fetchHistory = async (exercise) => {
      const res = await api.get(`/progress/by-exercise?exercise=${exercise}`);

      setHistory(prev => ({
        ...prev,
        [exercise]: res.data
      }));
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

    <Layout>
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
                  <button onClick={() => fetchHistory(ex.name)}>
                     Ver historial
                  </button>
                  {history[ex.name]?.map((h, i) => (
                    <p key={i}>
                      {h.weight}kg x {h.reps} - {new Date(h.date).toLocaleDateString()}
                    </p>
                  ))}
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
    </Layout>
  );
}