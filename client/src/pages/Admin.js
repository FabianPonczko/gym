import {  useEffect,useState,useRef } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";
import "./admin.css";
import Swal from "sweetalert2";
import LoadingOverlay from "../components/LoadingSpin";



export default function Admin() {
  const [cargando, setCargando] = useState(false);
  const [modificandoRutina, setModificandoRutina] = useState(false);
  const [ancho, setAncho] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineData, setSelectedRoutineData] = useState(null);
  const [tab, setTab] = useState("users");
  const [editingUser, setEditingUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [days, setDays] = useState([
    { day: "Día 1", exercises: [] }
  ]);
  const [userForm, setUserForm] = useState({
    
    name: "",
    email: "",
    password: "",
    role:""
  });

    const [routineForm, setRoutineForm] = useState({
    name: "",
    description: "",
    exercises: ""
  });


const convertirAISO = (fechaStr) => {
  const [dia, mes, anio] = fechaStr.split('-');
  return `${dia}/${mes}/${anio}`;
};
const scrollRef = useRef(null);
// filtro de fechas

const hoy = new Date().toISOString().split('T')[0];
  
  // Fecha de hace 7 días
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  const inicioDefault = hace7Dias.toISOString().split('T')[0];

  const [fechaInicio, setFechaInicio] = useState(inicioDefault);
  const [fechaFin, setFechaFin] = useState(hoy);

// ------------------

  const handleTabChange = (newTab) => {
  setTab(newTab);
  setSelectedUserProgress([])
  setModificandoRutina(false)
  // 🔥 limpiar selección cuando entrás a rutinas
  // setDays([ { day: "Día 1", exercises: [] }],routineForm.name="",selectedRoutine)
  handleDiscard()
  if (newTab !== "routines") {
    setSelectedRoutine("");
    setSelectedRoutineData(null);
  }
};

  const handleSelectRoutine = async (id) => {
    setAncho(true)
    setSelectedRoutine(id);
    setCargando(true)
    setModificandoRutina(true)
  try{
    const res = await api.get(`/routines/${id}`);
    setSelectedRoutineData(res.data);
    // 🔥 cargar en editor
    setRoutineForm({
      name: res.data.name,
      description: res.data.description || "",
      exercises: ""
    });
    
    setDays(res.data.days); // 👈 CLAVE

  }catch(err){
    console.log(err)
  }finally{
    setCargando(false)
  }
};

const moveExercise = (
  dayIndex,
  exIndex,
  direction
) => {

  const updatedDays =
    [...days];

  const exercises =
    updatedDays[dayIndex]
      .exercises;

  const newIndex =
    direction === "up"
      ? exIndex - 1
      : exIndex + 1;

  if (
    newIndex < 0 ||
    newIndex >= exercises.length
  ) {
    return;
  }

  [
    exercises[exIndex],
    exercises[newIndex]
  ] = [
    exercises[newIndex],
    exercises[exIndex]
  ];

  setDays(updatedDays);
};

const handleDiscard = () => {
  // 1. Reinicia los días a la estructura inicial
  setDays([{ day: "Día 1", exercises: [] }]); 
  
  // 2. Limpia los datos de la rutina seleccionada
  setSelectedRoutineData(null); 
  
  // 3. Reinicia el valor del select al texto por defecto
  setSelectedRoutine("Selecciona una rutina"); 
  
  // 4. Si usas un estado para el formulario, usa su setter (ejemplo):
  setRoutineForm({ ...routineForm, name: "" }); 

  setModificandoRutina(false)
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

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState("");
  
  const [selectedUserProgress, setSelectedUserProgress] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

   useEffect(() => {
    fetchUsers()
    fetchRoutines()
    fetchExercises();
    
  }, []);
 
 
  const fetchExercises = async () => {
    const res = await api.get("/exercises");
    setExercises(res.data);
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
    };
  // 🔐 protección básica
  let user = null;
  try {
    const token = localStorage.getItem("token");
    if (token) user = JSON.parse(atob(token.split(".")[1]));
  } catch {}

  if (!user || user.role !== "Admin") {
    return <h1>No autorizado</h1>;
  }

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
    setFilteredUsers(res.data); // 🔥 importante
  };

  const fetchRoutines = async () => {
    setCargando(true)
    try{
      const res = await api.get("/routines");
      setRoutines(res.data);
    }catch(err){
      console.log(err)
    }finally{
      setCargando(false)
    }
  };
  
  //trae progreso
  const fetchUserProgress = async (userId, name) => {
    setCargando(true);
  try {
    const res = await api.get(`/progress/user/${userId}`);
    setSelectedUserProgress(res.data);
    setSelectedUserName(name);
  } catch (err) {
    console.log(err);
  }finally{
    setCargando(false);
  }
};
  const grouped = selectedUserProgress.reduce((acc, p) => {
    if (!acc[p.exercise]) acc[p.exercise] = [];
    acc[p.exercise].push(p);
    return acc;
  }, {});
 
  // 👤 CREAR USUARIO
  const createUser = async () => {
    try {
      await api.post("/auth/register", userForm);
       Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Usuario creado",
      showConfirmButton: false,
      timer: 1500
    });
      
      setUserForm({ name: "", email: "", password: "" ,role:""});
      fetchUsers();
    } catch (err) {
      Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Error creando usuario",
      showConfirmButton: false,
      timer: 1500
    });
      
    }
  };

  // 🏋️ CREAR RUTINA
  // const createRoutine = async () => {
  //   try {
  //     const exercisesArray = routineForm.exercises.split(",").map(e => ({
  //       name: e.trim(),
  //       sets: 3,
  //       reps: 10
  //     }));

  //     await api.post("/routines", {
  //       name: routineForm.name,
  //       description: routineForm.description,
  //       exercises: exercisesArray
  //     });

  //     alert("Rutina creada 💪");
  //     setRoutineForm({ name: "", description: "", exercises: "" });
  //     fetchRoutines();
  //   } catch (err) {
  //       alert("Error creando rutina");
  //   }
  // };
  const createRoutine = async () => {
  await api.post("/routines", {
    name: routineForm.name,
    description: routineForm.description,
    days
  });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Rutina cargada",
      showConfirmButton: false,
      timer: 1500
    });
   fetchRoutines();

   // 🔥 limpiar selección (ESTO TE FALTA)
    setSelectedRoutine("");
    setSelectedRoutineData(null);

    // 🔥 resetear formulario
    setRoutineForm({ name: "", description: "", exercises: "" });
    setDays([{ day: "Día 1", exercises: [] }]);
};
  
  const updateRutine = async (routineId) => {
    await api.put(`/routines/${routineId}`, {
      name: routineForm.name,
      description: routineForm.description,
      days
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Rutina cargada",
      showConfirmButton: false,
      timer: 1500
    });
   fetchRoutines();

   // 🔥 limpiar selección (ESTO TE FALTA)
   handleDiscard()
};

  // 🔗 ASIGNAR

  const assignRoutine = async () => {
    if (!selectedUser || !selectedRoutine) return;

    await api.put("/users/assign-routine", {
      userId: selectedUser,
      routineId: selectedRoutine
    });

    
    Swal.fire({
      icon: "success",
      title: "Rutina asignada ",
      showConfirmButton: false,
      timer: 1500
    });
    fetchUsers();
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
    setDays([{ day: "Día 1", exercises: [] }],routineForm.name="",selectedRoutine);

    // 🔥 actualizar UI
    fetchRoutines();
    setSelectedRoutineData(null);
  }
};

  const deleteUser = async (id) => {
    const result = await Swal.fire({
    title: "¿Eliminar usuario?",
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
    await api.delete(`/users/${id}`);

    Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "El usuario fue borrado 🗑️",
      timer: 1500,
      showConfirmButton: false
    });
    // 🔥 actualizar UI
    fetchUsers();
    
  }
  
};
   

  return (
    <Layout>
    
    <LoadingOverlay cargando={cargando} />

    <div className="admin-container">

      {/* SIDEBAR */}
      <div className="sidebarAdmin">
        <h2>🏋️ Admin</h2>
          <button onClick={() => handleTabChange("users")} className={tab==="users" ? "active" : ""}>👤 Usuarios</button>
          <button onClick={() => handleTabChange("routines")} className={tab==="routines" ? "active" : ""}>🏋️ Rutinas</button>
          <button onClick={() => handleTabChange("assign")} className={tab==="assign" ? "active" : ""}>🔗 Asignar</button>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* 👤 USUARIOS */}
        {tab === "users" &&  (

        !selectedUserProgress.length > 0 ?(
         <div className="cardAdmin">
            <h2>Crear Usuario</h2>
              
            <input placeholder="Nombre" value={userForm.name}
              onChange={e => setUserForm({ ...userForm, name: e.target.value })} />

            <input placeholder="Email" value={userForm.email}
              onChange={e => setUserForm({ ...userForm, email: e.target.value })} />

            <input type="password" placeholder="Password" value={userForm.password}
              onChange={e => setUserForm({ ...userForm, password: e.target.value })} />

            <select value={userForm.role}
              onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="">Rol</option>
              <option value="client">Cliente</option>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>

            <button onClick={createUser}>Crear</button>

            <h2 style={{marginTop:20}}>Lista de usuarios</h2>

            {/* {users.map(u => (
              <div className="user-row" key={u._id}>
                <span>{u.name} - {u.email}</span>
                <span>{u.routine?.name || "Sin rutina"}</span>

                <button onClick={() => fetchUserProgress(u._id, u.name)}>
                  📊
                </button>
              </div>
            ))} */}
            <input
              placeholder="Buscar usuario..."
              className="search"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();

                if (!value) {
                  setFilteredUsers(users); // 🔥 restaura lista
                  return;
                }

                const filtered = users.filter(u =>
                  u.name.toLowerCase().includes(value) ||
                  u.email.toLowerCase().includes(value)
                );

                setFilteredUsers(filtered);
              }}
            />
           

        

  {/* tabla de usuarios */}
  <div className="table-wrapper">

  

  {/* 📱 MOBILE CARDS */}
  <div className="mobile-only">
    {filteredUsers.filter(p=>p.role==="client").map(u => (
      <div className="user-card" key={u._id}>
        
        <div className="user-header">
          <div className="avatar">
            {u.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="name">{u.name}</div>
            <div className="email">{u.email}</div>
          </div>
        </div>

        <div className="user-info">
          <span className={`badge ${u.role}`}>{u.role}</span>
          <span className="muted">
            {u.routine?.name || "Sin rutina"}
          </span>
        </div>

        <div className="actions">
          <button
            className="btn action-view"
            onClick={() => fetchUserProgress(u._id, u.name)}
            >
            📊 Ver métricas
          </button>

          <button
            className="btn action-delete"
            onClick={() => deleteUser(u._id)}
            >
            🗑️ Eliminar
          </button>
        </div>

      </div>
    ))}
  </div>

</div>

          </div>
        ):(
          null
        )
        )}

        {/* 🏋️ RUTINAS */}
        {tab === "routines" && (
          <div className="content-rutinas">
           <div >
            <div className="cardAdmin">

            <h2>{!modificandoRutina?"Crear Rutina":"Modificando Rutina"} </h2>
            <input
              placeholder="Nombre rutina"
              value={routineForm.name}
              onChange={(e) =>
                setRoutineForm({ ...routineForm, name: e.target.value })
              }
            />

            {days.map((day, dayIndex) => (
            <div >
              <div className="day-card" style={{background: dayIndex % 2==0?"#114ab415":"#3e32683f",marginBottom:"15px"}} key={dayIndex}>

                <div className="day-header">
                  <h3>{day.day}</h3>
                  {day.day !== "Día 1" &&(
                    <button onClick={() => removeDay(dayIndex)}>
                    ❌
                  </button>
                  )}

                </div>

                   

                  {day.exercises?.map((ex, exIndex) => {
                      // 1. Forzamos a obtener siempre el ID string limpio
                    const selectValue = ex.exercise && typeof ex.exercise === 'object' 
                    ? ex.exercise._id 
                    : ex.exercise;

                    return (
                        
                        <div className="exercise-row" key={exIndex}>
                          {/* SELECT EJERCICIO */}
                          <div className="btn-updown">

                            <button 
                              onClick={() =>
                                moveExercise(
                                  dayIndex,
                                  exIndex,
                                  "up"
                                )
                              }
                            >
                              ⬆
                            </button>

                            <button 
                              onClick={() =>
                                moveExercise(
                                  dayIndex,
                                  exIndex,
                                  "down"
                                )
                              }
                             
                            >
                              ⬇
                            </button>

                          </div>
                          <p style={{fontFamily:"italic", fontSize:"12px"}}>Ejercicio {exIndex +1} </p>
                          <select
                            value={selectValue || "Elegir ejercicio"} // 2. Usamos el ID limpio o un string vacío
                            onChange={(e) =>
                              updateExercise(dayIndex, exIndex, "exercise", e.target.value)
                            }
                          >
                            <option disabled value="Elegir ejercicio">Elegir ejercicio</option>

                            {exercises?.map((e) => (
                              <option key={e._id} value={e._id}>
                                {e.name} 
                              </option>
                            ))}
                          </select>
        
                          {/* Aquí van tus inputs de sets, reps y botón de eliminar */}
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
                          <button style={{background: "linear-gradient(135deg, #925f5f, #9f2332)"}}
                            onClick={() => removeExercise(dayIndex, exIndex)}
                          >
                            Borrar ejercicio 🗑️
                          </button>
                        
                        </div>
                        );
                  })} 
                      <button onClick={() => addExercise(dayIndex)}>
                        + Agregar ejercicio
                      </button>

                </div>
            </div>
            ))}

                <div style={{marginTop:20}}>
                  <button onClick={addDay}>+ Día</button>

                  {!modificandoRutina
                  ?
                  routineForm.name &&
                  <button className="save-btn" onClick={createRoutine}>
                    💾 Guardar rutina {routineForm.name}
                  </button>
                  :
                  <button className="save-btn" onClick={()=>updateRutine(selectedRoutine)}>
                    💾 Actualizar rutina 
                  </button>
                  }

                   {modificandoRutina && selectedRoutine !="Selecciona una rutina" &&(
                      <button 
                      className="btn-icon danger"
                      onClick={() => deleteRoutine(selectedRoutineData._id)}>🗑️ Borrar Rutina
                        </button>
                    )}
                </div>

          </div>
             
          {/* ****************************** */}


            <div className="cardAdmin">
                <h2>Modificar Rutinas</h2> 
                <select value={selectedRoutine || "Selecciona una rutina"}
                onChange={(e) => handleSelectRoutine(e.target.value)}>
                  <option disabled value="Selecciona una rutina">Selecciona una rutina</option>
                    {routines.map(r => (          
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>
                <button
                  className="btn-icon danger"
                  onClick={handleDiscard}>Descartar ❌
                </button>
                
                {/* {selectedRoutineData && routines.some(r => r._id === selectedRoutineData._id) && (
                // {selectedRoutineData && (
                  <div className="">
                    <h2>{selectedRoutineData.name}</h2>
                    {selectedRoutineData.days.map((day, dayIndex) => (
                      <div key={dayIndex}>
                        <h4>📅 {day.day}</h4>
                        {day.exercises.map((ex, exIndex) => (
                          <p  key={exIndex}>🏋️
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
                  
                )} */}
            </div>    

          </div>      
          

              {/* // preview rutinas */}
         
             
            {/* {routineForm && routineForm.name.length > 3 &&  (
                  // {selectedRoutineData && (
                    <div   className="cardAdmin">
                      <h2 >Preview de rutina </h2>

                      <h2>{selectedRoutineData.name}</h2>
                    {days?.map((day, i) => (
                      <div key={i}>
                        <h4>📅 {day.day}</h4>
                        {day.exercises.map((ex, j) => (
                          <p  key={j}>🏋️
                            {ex.exercise?.name || "Ejercicio"} → 
                            {ex.sets} x {ex.reps} aqui
                          </p>
                        ))}
                      </div>
                    ))}
                        <button
                          className="btn-icon danger"
                          onClick={() => setDays([ { day: "Día 1", exercises: [] }],routineForm.name="",selectedRoutine)}>Descartar ❌
                        </button>
                    </div>
                    
                  )} */}
            
        </div>
                


        )}
          
                  

        {/* 🔗 ASIGNAR */}
        {tab === "assign" && (
          ()=>setSelectedUserProgress([]),
          <div className="cardAdmin">
            <h2>Asignar rutina</h2>

            <select onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Usuario</option>
              {users.filter(p=>p.role==="client").map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>

            <select onChange={(e) => setSelectedRoutine(e.target.value)}>
              <option value="">Rutina</option>
              {routines.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>

            <button onClick={assignRoutine}>Asignar</button>
          </div>
        )}

      

{selectedUserProgress.length > 0 && (
  <div style={{ width: "90%", textAlign: "center" }}>
    <h2>Progreso de {selectedUserName}</h2>

    {/* 📅 Calendario */}
    
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' ,padding:10,borderRadius:10}}>
      <input 
        type="date" 
        className="btn"
        value={(fechaInicio)} 
        onChange={(e) => setFechaInicio(e.target.value)} 

      />
      <input 
        type="date" 
        className="btn"
        value={fechaFin} 
        onChange={(e) => setFechaFin(e.target.value)} 
      />
    </div>

    <div className="cardProgreso" ref={scrollRef}>
      


    {Object.keys(grouped).map((exercise) => {
  const dataFiltrada = grouped[exercise].filter(item => {
    const fechaISO = item.date.split('T')[0];
    return fechaISO >= fechaInicio && fechaISO <= fechaFin;
  });

  if (dataFiltrada.length === 0) return null;

   // 1. Cálculos de Récords y Progreso
  const todosLosPesos = dataFiltrada.map(d => d.weight);
  const maxHistorico = Math.max(...grouped[exercise].map(d => d.weight)); // Récord de todos los tiempos
  const maxActual = Math.max(...todosLosPesos); // Récord en este rango de fechas
  const ultimoPeso = dataFiltrada[dataFiltrada.length - 1].weight;
  
  // % de progreso respecto al récord histórico
  const porcentajePR = Math.min((ultimoPeso / maxHistorico) * 100, 100);

  return (
    <div key={exercise} style={styles.exerciseCard}>
      {/* Cabecera con nombre y récord */}
      <div style={styles.header}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{exercise}</h3>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Récord Personal: {maxHistorico}kg</span>
        </div>
        <div style={styles.badgePR}>
           {ultimoPeso} <small>kg actuales</small>
        </div>
      </div>

      {/* 📊 BARRA DE PROGRESO VISUAL */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBarBackground}>
          <div style={{ ...styles.progressBarFill, width: `${porcentajePR}%` }}>
            {porcentajePR === 100 && <span style={styles.prStar}>⭐ ¡Récord!</span>}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.75rem' }}>
          <span style={{ color: '#9ca3af' }}>0kg</span>
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{porcentajePR.toFixed(0)}% del PR</span>
          <span style={{ color: '#9ca3af' }}>{maxHistorico}kg</span>
        </div>
      </div>

      {/* Historial rápido (horizontal scroll) */}
      <div style={styles.historyList}>
        {console.log("datafiltrada",dataFiltrada)}
        {dataFiltrada.slice(0,5).map((log, i) => (
          <div key={i} style={styles.historyItem}>
            <span style={styles.dateLabel}>
              {new Date(log.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
            <span style={styles.valueLabel}>  {log.weight} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
})}






    </div>
   <div  className="cardAdmin" style={{width:"100%",background:"transparent",boxShadow:"none"}}>
            <button
            onClick={()=>setSelectedUserProgress([])}
            >Volver</button>
            </div>
  </div>
)}

      </div>
      </div>
      </Layout>
);
}

const styles = {
  exerciseCard: {
    background: "rgba(147, 153, 163, 0.12)",
    borderRadius: '20px',
    padding: '20px',
    margin: '10px',
    border: '1px solid rgba(255, 255, 255, 0.16)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '10px'
  },
  historyList: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto', // Scroll horizontal si hay muchos días
    paddingBottom: '5px'

  },
  historyItem: {
    background: 'rgba(0,0,0,0.2)',
    padding: '10px 15px',
    borderRadius: '12px',
    minWidth: '80px',
    textAlign: 'center'
  },
  dateLabel: { display: 'block', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' },
  valueLabel: { fontSize: '18px', fontWeight: 'bold', color: '#fff' },
  badge: { fontSize: '14px', fontWeight: 'bold', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '20px' },



  // ... (los estilos anteriores se mantienen) ...
  progressContainer: {
    margin: '20px 0',
    padding: '0 10px'
  },
  progressBarBackground: {
    height: '22px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)', // Degradado moderno
    borderRadius: '10px',
    transition: 'width 0.5s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgePR: {
    background: '#4f46e5',
    padding: '8px 12px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  prStar: {
    fontSize: '10px',
    color: '#fff',
    fontWeight: 'bold',
    textShadow: '0 0 5px rgba(0,0,0,0.5)'
  }
};
