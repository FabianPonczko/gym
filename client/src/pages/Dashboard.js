import { useEffect, useState, useRef } from "react";
import api from "./services/api";
import WeightModal from "../components/WeightModal";
import Layout from "../components/Layout"
import RecommendationCard from "../components/RecommendationCard";
import "./dashboard.css";
import Swal from "sweetalert2";
import LoadingOverlay from "../components/LoadingSpin";



export default function Dashboard() {
  const [loading,setLoading] = useState(false)
  const [cargando, setCargando] = useState({});   
  const [routine, setRoutine] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [history, setHistory] = useState({}); 
  const [recommendations, setRecommendations] = useState({});
  const [diaSeleccionado, setDiaSeleccionado] = useState(0);
  const [showHistory, setShowHistory] = useState({});
  const [verGif,setVerGif] = useState(false)
  const executed = useRef(false);
  const [exerciseGif, setExerciseGif] = useState(null);
  
  // 1. Agrega este estado al inicio de tu componente junto a los demás
  const [imgCargada, setImgCargada] = useState(false);

   const fetchRoutine = async () => {
      setLoading(true)
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
        setLoading(false)
      }
      
    };

 

  useEffect(() => {
      
    if (executed.current) return;
  
    executed.current = true;

    fetchRoutine();
   
    
  }, []);

  useEffect(()=>{
    
    if (!exerciseGif) return;

    const temporizador = setTimeout(() => {
      setExerciseGif(null)
    }, 6000);
    
    return () => clearTimeout(temporizador);

  },[exerciseGif])
  
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

//   const abrirGif = (exercise) => {
//   setExerciseGif(exercise);
// };
const abrirGif = (ex) => {
  setImgCargada(false); // Reinicia el estado de carga
  setExerciseGif(ex);   // Abre el modal
};

const irAlPrincipio = () => {
  window.scrollTo({
    top: 0,             // Sube hasta el píxel cero (el inicio)
    behavior: 'smooth'  // Hace que el movimiento sea suave, no un salto brusco
  });
};


  const fetchHistory = async (exercise) => {

  setCargando(prev => ({
    ...prev,
    [exercise]: true
  }));

  try {

    const res = await api.get(
      `/progress/by-exercise?exercise=${exercise}`
    );

    if (res.data.length === 0) {

      Swal.fire({
        icon: "info",
        title: "Sin historial",
        text: "Todavía no registraste pesos para este ejercicio"
      });

      return;
    }

    setHistory(prev => ({
      ...prev,
      [exercise]: res.data
    }));

    setShowHistory(prev => ({
      ...prev,
      [exercise]: true
    }));

  } catch (err) {

    console.error(err);

  } finally {

    setCargando(prev => ({
      ...prev,
      [exercise]: false
    }));
  }
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
      setHistory(prev => ({
          ...prev,
          [exercise]: null
        }));

        setShowHistory(prev => ({
          ...prev,
          [exercise]: false
        }));

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

const manejarCambio = (evento) => {
    setVerGif(evento.target.checked); // Accede a .checked, no a .value
  };

  return (
  <Layout>
    
    <div className="container">
      <h1 className="title">🏋️ Mi Rutina</h1>
      {/* <p>{routine?.expirationDate.split("T")[0]}</p> */}
      {routine ? (
        <>
          {/* 2. BARRA DE SOLAPAS */}
          <div className="tabs-container" style={{justifyContent: routine?.routine?.days.length < 5 ? "center" : "start"}} >
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
                  <h2 className="dayTitle"
                  onClick={irAlPrincipio}>
                    {day.day}
                  </h2>
                  
                  <div className="grid">
                    {day.exercises.map((item, i) => {
                      const ex = item.exercise || item;
                      return (
                        <div className="cardDashboard" key={i}
                        
                        >
                          <span>Ejercicio {i+1}</span>
                          <h3 
                            style={{padding:"10px"}}
                            onClick={()=>abrirGif(ex)}
                          >{ex.name}</h3>

                          {/* <div className="cardDashboard" key={i}> */}

                          {/* <img
                            src={`/ejercicios/${ex.name}.gif`}
                            alt={ex.name}
                            className="exercise-thumb"
                            onClick={() => abrirGif(ex)}
                            /> */}

                          {/* <h3>{ex.name}</h3> */}

                        {/* </div> */}
                          <p>{item.sets} Series x {item.reps} Rep {item.weight || null} {item.weight ? "kg" : null}</p>
                          
                          <div className="buttons-container">
                            <button onClick={() => abrirModal(ex.name)}>Registrar peso</button>
                            
                            <button
                             style={{
                              background:
                                cargando[ex.name]
                                  ? "none"
                                  : null
                            }}
                            
                            onClick={() => {

                              if (history[ex.name]) {
                                  
                                setShowHistory(prev => ({
                                  ...prev,
                                  [ex.name]:
                                    !prev[ex.name]
                                }));

                              } else {

                                fetchHistory(ex.name);
                              }
                            }}

                            className={`btn-rec ${history[ex.name]?.length > 0 &&
                              showHistory[ex.name]
                                ? "hide"
                                : "show"
                            }`}
                          >
                            {/* {cargando[ex.name]
                              ? "Cargando..."
                              : showHistory[ex.name]
                                ? "❌ Ocultar historial"
                                : "💡 Ver historial"} */}

                              {cargando[ex.name]
                                ? "Cargando..."
                                : history[ex.name]?.length > 0
                                  ? (
                                      showHistory[ex.name]
                                        ? "❌ Ocultar historial"
                                        : "💡 Ver historial"
                                    )
                                  : "💡 Ver historial"}
                          </button>
                            
                          </div>

                          {/* {history[ex.name]?.map((h, idx) => (
                            <div key={idx} style={{ border: "solid 1px rgba(98, 89, 89, 0.13)", textAlign: "center" }}>
                              <p>{h.weight}kg x {h.reps} - {new Date(h.date).toLocaleDateString()}</p>
                            </div>
                          ))} */}
                          {showHistory[ex.name] &&
                            history[ex.name]?.map((h, idx) => (

                              <div
                                key={idx}
                                style={{
                                  border:
                                    "solid 1px rgba(98, 89, 89, 0.13)",
                                  textAlign: "center",
                                  width:"80%",
                                  paddingInline:50,
                                  background:"rgba(147, 147, 140, 0.33)",
                                  borderRadius:5,
                                  marginBlock:5                                  
                                }}
                              >
                                <p>
                                  {h.weight}kg x {h.reps} -{" "}
                                  {new Date(h.date)
                                    .toLocaleDateString()}
                                </p>
                              </div>

                          ))
                        }
                          {showHistory[ex.name] &&<button
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
                          }
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
        loading ? 
        <LoadingOverlay cargando={cargando}></LoadingOverlay>
        :
        <p className="muted">rutina no encontrada o ha caducado</p>
      )}

      {selectedExercise && (
        <WeightModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onSave={guardarPeso}
        />
      )}
        <div
          className={`gif-overlay ${exerciseGif ? 'show' : ''}`}
          onClick={() => setExerciseGif(null)}
          >
          <div
            className="gif-modal"
            onClick={(e) =>( e.stopPropagation(),setExerciseGif(null))}
            >
            {/* <button
              className="gif-close"
              onClick={() => setExerciseGif(null)}
              >
              ✕
            </button> */}

          {exerciseGif && (
  <>
    <h2>{exerciseGif.name}</h2>

    {/* Si la imagen NO ha cargado, mostramos el Spinner */}
    {!imgCargada && (
      <div className="spinner-contenedor">
        <div className="spinner-visual"></div>
        <p>Cargando ejercicio...</p>
      </div>
    )}

    {/* La imagen siempre se procesa, pero la controlamos con CSS mediante la clase */}
    <img
      src={`/ejercicios/${exerciseGif.name}.gif`}
      alt={exerciseGif.name}
      onLoad={() => setImgCargada(true)} /* <- CUANDO CARGA, CAMBIA EL ESTADO */
      className={`img-modal-gif ${imgCargada ? 'visible' : 'oculta'}`}
    />
  </>
)}
          </div>
        </div>
    </div>
  </Layout>
);
}