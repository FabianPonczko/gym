import { useEffect, useState } from "react";
import api from "./services/api";
import WeightModal from "../components/WeightModal";
import Layout from "../components/Layout"
import RecommendationCard from "../components/RecommendationCard";
import "./dashboard.css";
import Swal from "sweetalert2";


export default function Dashboard() {
  const [routine, setRoutine] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [history, setHistory] = useState({}); 
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await api.get("/users/my-routine");
        setRoutine(res.data)
        !routine &&
        Swal.fire({
          position: "top-center",
          icon: "info", 
          title: "No tienes una rutina asignada",
          showConfirmButton: false,
          timer: 2500
        });
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
  if (history[exercise]) {
      setHistory(prev => {
        const copy = { ...prev };
        delete copy[exercise];
        return copy;
      });
      return;
    }
      setHistory(prev => ({
        ...prev,
        [exercise]: res.data
      }));
    };
 
  const toggleRecommendation = async (exercise) => {
  // 👉 si ya existe → ocultar
  if (recommendations[exercise]) {
    setRecommendations(prev => {
      const copy = { ...prev };
      delete copy[exercise];
      return copy;
    });
    return;
  }
  
  // 👉 si no existe → traer y mostrar
  const res = await api.get(`/progress/recommendation?exercise=${exercise}`);

  setRecommendations(prev => ({
    ...prev,
    [exercise]: res.data
  }));
};

  // 👉 guarda desde el modal
  const guardarPeso = async (data) => {
    try {
      await api.post("/progress", data);
      alert("Guardado 💪");
       fetchHistory(data.exercise);
    } catch (err) {
      console.log(err);
    }
  };

const adjustRoutine = async () => {
  try {
    const res = await api.post("/routines/adjust");

    setRoutine(res.data);

    alert("Rutina ajustada automáticamente 🤖");
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
        {/* <h2 className="routine-name">{routine.name}</h2> */}
            {/* <button onClick={adjustRoutine}>
              🤖 Ajustar rutina automáticamente
            </button> */}
            {/* <div className="grid">
              {routine.exercises.map((ex, i) => (
                <div className="card" key={i}>
                  <h3>{ex.name}</h3>
                  <p>{ex.sets} x {ex.reps} - {ex.weight} kg</p>

                  <button onClick={() => abrirModal(ex.name)}>
                    Registrar peso
                  </button>
                  <button onClick={() => fetchHistory(ex.name)}
                     className={`btn-rec ${
                       history[ex.name]  ? "hide" : "show"
                      }`}>
                        {history[ex.name]  ? "❌ Ocultar historial" : "💡 Ver historial"}
                       </button>
                  {history[ex.name]?.map((h, i) => (
                    <p key={i}>
                      {h.weight}kg x {h.reps} - {new Date(h.date).toLocaleDateString()}
                    </p>
                  ))}
                  <button
                  onClick={() => toggleRecommendation(ex.name)}
                  className={`btn-rec ${
                    recommendations[ex.name] ? "hide" : "show"
                  }`}
                >
                  {recommendations[ex.name] ? "❌ Ocultar recomendación" : "💡 Ver recomendación"}
                </button>
                  {recommendations[ex.name] && (
                  <p>
                     <RecommendationCard data={recommendations[ex.name]} />
                  </p>
                  )}
                
                </div>
              ))}
            </div> */}
            <div className="days-container">
              {routine.days.map((day, dayIndex) => (
                <div className="day-card" key={dayIndex}>
                  <h2>{day.day}</h2>
                  <div className="grid">
                    {day.exercises.map((item, i) => {
                      const ex = item.exercise || item;
                      return (
                        <div className="card" key={i}>

                        <h3>{ex.name}</h3>

                        <p>{item.sets} Reps  x {item.reps}  Series   {item.weight || null} {item.weight ? "kg" : null}</p>

                       <div className="buttons-container">

                        <button onClick={() => abrirModal(ex.name)}>
                          Registrar peso
                        </button>

                        <button
                          onClick={() => fetchHistory(ex.name)}
                          className={`btn-rec ${
                            history[ex.name] ? "hide" : "show"
                          }`}
                        >
                          {history[ex.name]
                            ? "❌ Ocultar historial"
                            : "💡 Ver historial"}
                        </button>
                        </div>
                        {history[ex.name]?.map((h, idx) => (
                          <p key={idx}>
                            {h.weight}kg x {h.reps} -{" "}
                            {new Date(h.date).toLocaleDateString()}
                          </p>
                        ))}

                        {/* <button
                          onClick={() => toggleRecommendation(ex.name)}
                          className={`btn-rec ${
                            recommendations[ex.name] ? "hide" : "show"
                          }`}
                        >
                          {recommendations[ex.name]
                            ? "❌ Ocultar recomendación"
                            : "💡 Ver recomendación"}
                        </button> */}

                        {/* {recommendations[ex.name] && (
                          <RecommendationCard
                            data={recommendations[ex.name]}
                          />
                        )} */}
                      </div>
                    );
        })}
      </div>
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