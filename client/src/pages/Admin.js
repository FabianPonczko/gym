import {  useEffect,useState } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";
import "./admin.css";
import Swal from "sweetalert2";

export default function Admin() {
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

  const handleTabChange = (newTab) => {
  setTab(newTab);

  // 🔥 limpiar selección cuando entrás a rutinas
  if (newTab !== "routines") {
    setSelectedRoutine("");
    setSelectedRoutineData(null);
  }
};

  const handleSelectRoutine = async (id) => {
  setSelectedRoutine(id);

  const res = await api.get(`/routines/${id}`);
  setSelectedRoutineData(res.data);
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
    const res = await api.get("/routines");
    setRoutines(res.data);
  };
  
  //trae progreso
  const fetchUserProgress = async (userId, name) => {
  try {
    const res = await api.get(`/progress/user/${userId}`);
    setSelectedUserProgress(res.data);
    setSelectedUserName(name);
  } catch (err) {
    console.log(err);
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
        {tab === "users" && (
         
         <div className="card">
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
    {filteredUsers.map(u => (
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
        )}

        {/* 🏋️ RUTINAS */}
        {tab === "routines" && (
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


            <div className="">
                <h2>Rutinas existentes</h2> 
                <select onChange={(e) => handleSelectRoutine(e.target.value)}>
                  <option value="">Selecciona una rutina</option>
                  {routines.map(r => (          
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
                
                {selectedRoutineData && routines.some(r => r._id === selectedRoutineData._id) && (
                // {selectedRoutineData && (
                  <div className="">
                    {/* <h2>{selectedRoutineData.name}</h2> */}
                    
                    {selectedRoutineData.days.map((day, i) => (
                      <div key={i}>
                        <h4>📅 {day.day}</h4>
                        {day.exercises.map((ex, j) => (
                          <p  key={j}>🏋️
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

  
          
          </div>
        )}
          
                  

        {/* 🔗 ASIGNAR */}
        {tab === "assign" && (
          <div className="card">
            <h2>Asignar rutina</h2>

            <select onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Usuario</option>
              {users.map(u => (
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

        {/* 📊 PROGRESO */}
        {selectedUserProgress.length > 0 && (
          <div className="card">
            <h2>Progreso de {selectedUserName}</h2>

            {Object.keys(grouped).map((exercise) => (
              <div key={exercise}>
                <h3>{exercise}</h3>
                <ProgressChart data={grouped[exercise]} />
              </div>
            ))}
          </div>
        )}

      </div>
      </div>
      </Layout>
);
}