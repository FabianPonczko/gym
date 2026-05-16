import { useEffect, useState } from "react";
import api from "./services/api";
import WeightModal from "../components/WeightModal";
import Layout from "../components/Layout"
import RecommendationCard from "../components/RecommendationCard";
import "./dashboard.css";
import Swal from "sweetalert2";
import LoadingOverlay from "../components/LoadingSpin";


export default function Dashboard() {
  const [cargando,setCargando] = useState(false)
  const [routine, setRoutine] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [history, setHistory] = useState({}); 
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    const fetchRoutine = async () => {
      setCargando(true)
      try {
        const res = await api.get("users/my-routine");
     if (res.data && res.data.days && res.data.days.length >0 ) {
        setRoutine(res.data);
      } else {
        // 2. Si la API responde pero no hay datos reales de rutina
        sinRutina();
      }
        
      } catch (err) {
        console.log(err);
        sinRutina()
      } finally{
        setCargando(false)
      }
      
    };

    fetchRoutine();
    
    
  }, []);
  
  const sinRutina = () =>{
              Swal.fire({
                 position: "center",
                 icon: "info", 
                 title: "No tienes una rutina asignada",
                 showConfirmButton: false,
                 timer: 2500
               });
  }

  // 👉 abre el modal
  const abrirModal = (exercise) => {
    setSelectedExercise(exercise);
  };

  
         
  const fetchHistory = async (exercise) => {
    setCargando(true)
    try{

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
    }catch(err){
      console.log(err); 
    }finally{
      setCargando(false);
    };
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
      <LoadingOverlay cargando={cargando}></LoadingOverlay>

      <div className="container">
        <h1 className="title">🏋️ Mi Rutina</h1>
        {routine ? (
          <>
            <div className="days-container-dashboard">
              {routine.days.map((day, dayIndex) => (
                <div className="day-card" key={dayIndex}>
                  <h2>{day.day}</h2>
                  <div className="grid">
                    {day.exercises.map((item, i) => {
                      const ex = item.exercise || item;
                      return (
                        <div className="cardDashboard" key={i}>

                        <h3>{ex.name}</h3>

                        <p>{item.sets} Series  x  {item.reps}  Rep   {item.weight || null} {item.weight ? "kg" : null}</p>

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