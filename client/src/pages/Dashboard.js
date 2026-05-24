import { useEffect, useState, useRef } from "react";
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

  const executed = useRef(false);
 
  useEffect(() => {
      
    if (executed.current) return;
      
    executed.current = true;
    
    const fetchRoutine = async () => {
      setCargando(true)
      try {
        const res = await api.get("users/my-routine");
       
     if (res.data.routine  && res.data.routine.days && res.data.routine.days.length >0 ) {
      
      // Supongamos que la API devuelve 'routineExpiration' en el objeto del usuario o de la rutina
        const expirationDate = res.data.expirationDate;
       
        if (expirationDate) {
         
          const getNow = () => {
         
            const date = new Date();

            const year = date.getFullYear();

            const month = String(date.getMonth() + 1).padStart(2, "0");

            const day = String(date.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
          };
                  
          // 2. Si la fecha actual superó la de caducidad, ejecutar sinRutina
          if (getNow() > expirationDate.split("T")[0]) {
            // Swal.fire({
            //      position: "center",
            //      icon: "info", 
            //      title: "La rutina ha caducado.",
            //      showConfirmButton: false,
            //      timer: 2500
            //    });
            
            sinRutina("Tu rutina ha caducado. Contacta a tu entrenador para una nueva asignación.");
            return; // Detiene la ejecución aquí
          }
        }

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
  
  const sinRutina = (msg) =>{
              Swal.fire({
                 position: "center",
                 icon: "info", 
                 title: msg || "No tienes una rutina asignada",
                 showConfirmButton: true,
                 
                  customClass: {
                  title: "swal-small-title",
                  },
               });
  }

  // 👉 abre el modal
  const abrirModal = (exercise) => {
    setSelectedExercise(exercise);
  };

  
         
  const fetchHistory = async (exercise) => {
    // setCargando(true)
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
      // setCargando(false);
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
    fetchHistory(exercise);
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
    try {
      await api.post("/progress", data);
      fetchHistory(data.exercise);
      Swal.fire({
                position: "center",
                icon: "success", 
                title: "Peso registrado correctamente",
                showConfirmButton: false,
                timer: 2000
              });
    } catch (err) {
       Swal.fire({
                position: "center",
                icon: "error", 
                title: "Error peso no registrado",
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
      {/* <p>{routine?.expirationDate.split("T")[0]}</p> */}
      {routine ? (
        <>
          {/* 2. BARRA DE SOLAPAS */}
          <div className="tabs-container" style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '10px' }}>
            {routine.routine.days.map((day, index) => (
              <button
                key={index}
                onClick={() => setDiaSeleccionado(index)}
                style={{
                  padding: '20px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: diaSeleccionado === index ? '#007bff' : '#e0e0e060',
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
            {routine.routine.days.map((day, dayIndex) => {
              if (dayIndex !== diaSeleccionado) return null;

              return (
                <div className="day-card" key={dayIndex}>
                  <h2>{day.day}</h2>
                  <div className="grid">
                    {day.exercises.map((item, i) => {
                      const ex = item.exercise || item;
                      return (
                        <div className="cardDashboard" key={i}>
                          <span>Ejercicio {i+1}</span>
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
        <p className="muted">rutina no encontrada o ha caducado</p>
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