import { useEffect, useState } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";
import Swal from "sweetalert2";
import "./coach.css";

export default function Coach() {
  const [clients, setClients] = useState([]);
  const [routines, setRoutines] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [filteredUsers, setFilteredUsers] = useState([]);
  // const [search, setSearch] = useState("");
  const [selectedRoutineData, setSelectedRoutineData] = useState(null);
  // const [tab, setTab] = useState("users");
  // const [editingUser, setEditingUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [editingRoutine, setEditingRoutine] = useState(null);
 
  const [days, setDays] = useState([
    { day: "Día 1", exercises: [] }
  ]);

  const [routineForm, setRoutineForm] = useState({
    name: "",
    description: "",
    exercises: ""
  });

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState("");

  const [selectedClientProgress, setSelectedClientProgress] = useState([]);
  
const [selectedClientName, setSelectedClientName] = useState("");

const fetchClientProgress = async (userId, name) => {
  try {
    const res = await api.get(`/progress/user/${userId}`);
    setSelectedClientProgress(res.data);
    setSelectedClientName(name);
  } catch (err) {
    console.log(err);
  }
};
const grouped = selectedClientProgress.reduce((acc, p) => {
  if (!acc[p.exercise]) acc[p.exercise] = [];
  acc[p.exercise].push(p);
  return acc;
}, {});

//  const handleSelectRoutine = async (id) => {
//   setSelectedRoutine(id);

//   const res = await api.get(`/routines/${id}`);
//   setSelectedRoutineData(res.data);
// };

// selected rutinas
const handleSelectRoutine = async (id) => {
  setSelectedRoutine(id);

  const res = await api.get(`/routines/${id}`);

  setSelectedRoutineData(res.data);

  // 🔥 cargar en editor
  setRoutineForm({
    name: res.data.name,
    description: res.data.description || ""
  });

  setDays(res.data.days); // 👈 CLAVE
};

// eliminar día
const removeDay = (index) => {
  setDays(days.filter((_, i) => i !== index));
};

// eliminar ejercicio
const removeExercise = (dayIndex, exIndex) => {
  const updated = [...days];
  updated[dayIndex].exercises.splice(exIndex, 1);
  setDays(updated);
};

 const addDay = () => {
      setDays([...days, { day: `Día ${days.length + 1}`, exercises: [] }]);
    };
    const addExercise = (dayIndex) => {
      const updated = [...days];

      updated[dayIndex].exercises.push({
        exercise: "",
        sets: 3,
        reps: 10
      });

      setDays(updated);
    };

      const updateExercise = (dayIndex, exIndex, field, value) => {
      const updated = [...days];
      updated[dayIndex].exercises[exIndex][field] = value;
      setDays(updated);
      setEditingRoutine(value)
      // console.log("editingroutine:", value); 
       };

const deleteRoutine = async (id) => {
  const result = await Swal.fire({
    title: "¿Eliminar rutina?",
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
    await api.delete(`/routines/${id}`);

    Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "La rutina fue borrada 🗑️",
      timer: 1500,
      showConfirmButton: false
    });

    // 🔥 actualizar UI
    fetchRoutines();
    setSelectedRoutineData(null);
  }
};



useEffect(() => {
    fetchClients();
    fetchRoutines();
    fetchExercises()
  }, [selectedRoutineData]);

const fetchExercises = async () => {
    const res = await api.get("/exercises");
    setExercises(res.data);
  };

  // 🔐 verificar rol
  let user = null;
  try {
    const token = localStorage.getItem("token");
    if (token) user = JSON.parse(atob(token.split(".")[1]));
  } catch {}

  if (!user || user.role !== "coach") {
    return <h1>No autorizado</h1>;
  }

 

  const fetchClients = async () => {
    const res = await api.get("/users");
      const onlyClients = res.data.filter(u => u.role === "client");
      setClients(onlyClients);
      
   
    
    
  };

  const fetchRoutines = async () => {
    const res = await api.get("/routines");
    setRoutines(res.data);
  };

  // 🏋️ crear rutina
    const createRoutine = async () => {
  await api.post("/routines", {
    name: routineForm.name,
    description: routineForm.description,
    days
  });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Rutina",
      showConfirmButton: false,
      timer: 1500
    });
   

   // 🔥 limpiar selección (ESTO TE FALTA)
    setSelectedRoutine("");
    setSelectedRoutineData(null);

    // 🔥 resetear formulario
    setRoutineForm({ name: "", description: "", exercises: "" });
    setDays([{ day: "Día 1", exercises: [] }]);
};

const updateRoutine = async () => {
  console.log("selectedRoutine",selectedRoutine)
  await api.put(`/routines/${selectedRoutine}`, {
    name: routineForm.name,
    description: routineForm.description,
    days
  });

  Swal.fire("Actualizada ✅", "", "success");

  fetchRoutines();
};

  // 🔗 asignar rutina a cliente
  const assignRoutine = async () => {
    if (!selectedClient || !selectedRoutine) return;

    await api.put("/users/assign-routine", {
      userId: selectedClient,
      routineId: selectedRoutine
    });

    alert("Asignado ✅");
    fetchClients();
  };

 

  return (
  <Layout>
    <div className="coach-container">

      {/* 👥 CLIENTES */}
      <div className="coach-sidebar">
        <h2>Clientes</h2>

        {clients.map(c => (
          <div
            key={c._id}
            className={`client-item ${selectedClientName === c.name ? "active" : ""}`}
            onClick={() => fetchClientProgress(c._id, c.name)}
          >
            <div className="avatar">
              {c.name.charAt(0)}
            </div>

            <div>
              <div className="name">{c.name}</div>
              <div className="routine">
                {c.routine?.name || "Sin rutina"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 CONTENIDO */}
      <div className="coach-content">

        {!selectedClientName ? (null ) : (
          <>
              <h2>{selectedClientName}</h2>
          <div style={{display:"flex"}}>
            <div className="coach-header">
            </div>

           

            {/* CREAR RUTINA */}
            {/* <div className="card">
              <h3>Crear rutina</h3>

              <input
                placeholder="Nombre"
                value={routineForm.name}
                onChange={e => setRoutineForm({ ...routineForm, name: e.target.value })}
              />
              <input
                placeholder="Descripción"
                value={routineForm.description}
                onChange={e => setRoutineForm({ ...routineForm, description: e.target.value })}
              />
              <input
                placeholder="Ejercicios (pecho, espalda...)"
                value={routineForm.exercises}
                onChange={e => setRoutineForm({ ...routineForm, exercises: e.target.value })}
              />

              <button onClick={createRoutine}>Crear rutina</button>
            </div> */}
            <div className="card">
            <div className="routine-editor">
            <h2>Crear Rutina</h2>
            <input
              placeholder="Nombre rutina"
              value={routineForm.name}
              onChange={(e) =>
                setRoutineForm({ ...routineForm, name: e.target.value })
              }
            />

            {days.map((day, dayIndex) => (
              <div className="day-card" key={dayIndex}>

                <div className="day-header">
                  <h3>{day.day}</h3>

                  <button onClick={() => removeDay(dayIndex)}>
                    ❌
                  </button>
                </div>

                {day.exercises.map((ex, exIndex) => (
                  <div className="exercise-row" key={exIndex}>
                    <p style={{fontSize:"smaller", color:"#aaaa95"}}>Ejercicio {exIndex + 1}</p> 
                    {/* SELECT EJERCICIO */}
                    <select
                      value={ex.exercise}
                      onChange={(e) =>
                        updateExercise(dayIndex, exIndex, "exercise", e.target.value)
                      }
                    >
                      <option value="">Elegir ejercicio</option>

                      {exercises.map((e) => (
                        <option key={e._id} value={e._id}>
                          {e.name}
                        </option>
                      ))}
                    </select>

                    {/* SETS */}
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) =>
                        updateExercise(dayIndex, exIndex, "sets", e.target.value)
                      }
                    />

                    {/* REPS */}
                    <input
                      type="number"
                      value={ex.reps}
                      onChange={(e) =>
                        updateExercise(dayIndex, exIndex, "reps", e.target.value)
                      }
                    />

                    {/* DELETE */}
                    <button
                      onClick={() => removeExercise(dayIndex, exIndex)}
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <button onClick={() => addExercise(dayIndex)}>
                  + Agregar ejercicio
                </button>

              </div>
            ))}

            <button onClick={addDay}>+ Día</button>

            <button className="save-btn" onClick={createRoutine}>
              💾 Guardar rutina
            </button>

          </div>
             
          {/* ****************************** */}


               

  
          
          </div>
            {/* ASIGNAR */}
            
            {routineForm && routineForm.name.length < 3 && (

            
            <div className="card">
              <h2>Asignar rutina</h2>

              <select onChange={(e) => setSelectedClient(e.target.value)}>
                <option value="">Cliente</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <select onChange={(e) => setSelectedRoutine(e.target.value)}>
                <option value="">Rutina</option>
                {routines.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>

              <button onClick={assignRoutine}>Asignar</button>

               <div className="">
                <h2>Rutinas existentes</h2> 
                
                <select defaultValue="Seleccione una opción"  onChange={(e) => handleSelectRoutine(e.target.value)}>
                  
                  <option value="Seleccione una opción" disabled>Seleccione una opción</option>
                    {routines?.map(r => (          
                      <option  key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              
                
                  <button className="save-btn" onClick={updateRoutine} >
                    ✏️ Actualizar rutina
                  </button>
                
                
                
              </div>
            </div>
            )}
            
            <div>
              {selectedRoutineData && routines.some(r => r._id === selectedRoutineData._id) && (
                // {selectedRoutineData && (
                  <div className="card">
                    {/* <h2>{selectedRoutineData.name}</h2> */}
                    
                    {selectedRoutineData.days.map((day, i) => (
                      <div key={i}>
                        <h4>📅 {day.day}</h4>
                        {day.exercises.map((ex, j) => (
                          <p  className="exercise-item" key={j}>🏋️
                            {ex.exercise?.name || "Ejercicio"} → 
                            {ex.sets} x {ex.reps}
                          </p>
                        ))}
                      </div>
                    ))}
                      <button
                        className="btn-icon danger"
                        onClick={() => deleteRoutine(selectedRoutineData._id)}>🗑️
                      </button>
                  </div>
                  
                )}
            </div>
            {/* ****************************  */}
             
                 <div>
              {routineForm && routineForm.name.length > 3 &&  (
                // {selectedRoutineData && (
                  <div className="card" style={{color:"#988"}}>
                    <h2 >Preview </h2>
                    <h3>{routineForm.name}</h3>

                    {days.map((day, i) => (
                      <div key={i}>
                        <h4>📅 {day.day}</h4>
                        {day.exercises.map((ex, j) => {
                          const found = exercises.find(e => e._id === ex.exercise);
                            return (
                              <p key={j}>
                                {found?.name } → {ex.sets} x {ex.reps}
                              </p>
                            );
                        })}
                      </div>
                    ))}
                      <button
                        className="btn-icon danger"
                        onClick={() => setDays([ { day: "Día 1", exercises: [] }],routineForm.name="",selectedRoutine)}>Descartar ❌
                      </button>
                  </div>
                  
                )}
          {/* <div>{routineForm.name  &&(
            <div className="card">
              <h2>Preview</h2>

              {days.map((d, i) => (
                <div key={i}>
                  <h4>{d.day}</h4>

                  {d.exercises.map((ex, j) => {
                    const found = exercises.find(e => e._id === ex.exercise);

                    return (
                      <p key={j}>
                        {found?.name || "Ejercicio"} → {ex.sets} x {ex.reps}
                      </p>
                    );
                  })}
                </div>
              ))}
            </div>
            )}
          </div> */}


            </div>

          </div>      
          <div>

          
             {/* GRÁFICOS */}
            <div className="card">
              {Object.keys(grouped).map((exercise) => (
                <div className="card" key={exercise}>
                  <h3>{exercise}</h3>
                  <ProgressChart
                    data={grouped[exercise].sort(
                      (a, b) => new Date(a.date) - new Date(b.date)
                    )}
                  />
                </div>
              ))}
            </div>
            </div>
          </>
        )}

      </div>
    </div>
  </Layout>
);
}