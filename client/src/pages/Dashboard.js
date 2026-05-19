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
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);

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
  
  const borrarEjercicio = async (exercise) => {
    const result = await Swal.fire({
    title: "¿Eliminar progreso?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try{

      await api.delete(
        `/progress/exercise/${exercise}`
      );

      Swal.fire({
        icon: "success",
        title: "Progreso eliminado",
        text: "El progreso fue borrado 🗑️",
        timer: 1500,
        showConfirmButton: false
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error", 
        text: "No se pudo eliminar el progreso",
        timer: 1500,
        showConfirmButton: false
      }); 
    }
};
}
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
    Swal.fire({
              position: "center",
              icon: "success", 
              title: "Peso registrado correctamente",
              showConfirmButton: false,
              timer: 2000
            });
    try {
      await api.post("/progress", data);
      
      fetchHistory(data.exercise);
    } catch (err) {
       Swal.fire({
                position: "center",
                icon: "error", 
                title: "Error registrado correctamente",
                showConfirmButton: false,
                timer: 2000
              });
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
          {/* 2. BARRA DE SOLAPAS */}
          <div className="tabs-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {routine.days.map((day, index) => (
              <button
                key={index}
                onClick={() => setDiaSeleccionado(index)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: diaSeleccionado === index ? '#007bff' : '#e0e0e0',
                  color: diaSeleccionado === index ? 'white' : 'black',
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
              >
                {day.day}
              </button>
            ))}
          </div>

          {/* 3. CONTENIDO FILTRADO */}
          <div className="days-container-dashboard">
            {/* Solo mostramos el día que coincide con el índice del estado */}
            {routine.days.map((day, dayIndex) => {
              if (dayIndex !== diaSeleccionado) return null;

              return (
                <div className="day-card" key={dayIndex}>
                  <h2>{day.day}</h2>
                  <div className="grid">
                    {day.exercises.map((item, i) => {
                      const ex = item.exercise || item;
                      return (
                        <div className="cardDashboard" key={i}>
                          <h3>{ex.name}</h3>
                          <p>{item.sets} Series x {item.reps} Rep {item.weight || null} {item.weight ? "kg" : null}</p>
                          
                          <div className="buttons-container">
                            <button onClick={() => abrirModal(ex.name)}>Registrar peso</button>
                            <button
                              onClick={() => fetchHistory(ex.name)}
                              className={`btn-rec ${history[ex.name]?.length > 0 ? "hide" : "show"}`}
                            >
                              {history[ex.name]?.length > 0 ? "❌ Ocultar historial" : "💡 Ver historial"}
                            </button>
                          </div>

                          {history[ex.name]?.map((h, idx) => (
                            <div key={idx} style={{ border: "solid 1px rgba(98, 89, 89, 0.13)", textAlign: "center" }}>
                              <p>{h.weight}kg x {h.reps} - {new Date(h.date).toLocaleDateString()}</p>
                            </div>
                          ))}

                          <button
                            style={{ backgroundColor: "rgba(232, 51, 27, 0.81)", color: "white", justifyContent: "center", marginTop: '10px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              borrarEjercicio(ex.name);
                            }}
                            
                             className={`btn-eliminar ${
                            history[ex.name] && history[ex.name].length > 0 ? "hide" : "show"
                          }`}
                          >
                            Borrar progreso 🗑️
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>Cargando rutina...</p>
      )}

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