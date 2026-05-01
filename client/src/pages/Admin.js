import {  useEffect,useState } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";
import "./admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [routines, setRoutines] = useState([]);
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
      alert("Usuario creado ✅");
      setUserForm({ name: "", email: "", password: "" ,role:""});
      fetchUsers();
    } catch (err) {
      alert("Error al crear usuario");
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

  alert("Rutina creada 💪");
};

  // 🔗 ASIGNAR

  const assignRoutine = async () => {
    if (!selectedUser || !selectedRoutine) return;

    await api.put("/users/assign-routine", {
      userId: selectedUser,
      routineId: selectedRoutine
    });

    alert("Rutina asignada ✅");
    fetchUsers();
  };

  const deleteUser = async (id) => {
  if (!window.confirm("¿Eliminar usuario?" + id)) return;

  await api.delete(`/users/${id}`);
  fetchUsers();
};
   


  return (
  <Layout>
    <div className="admin-container">

      {/* SIDEBAR */}
      <div className="sidebarAdmin">
        <h2>🏋️ Admin</h2>

        <button onClick={() => setTab("users")} className={tab==="users" ? "active" : ""}>
          👤 Usuarios
        </button>

        <button onClick={() => setTab("routines")} className={tab==="routines" ? "active" : ""}>
          🏋️ Rutinas
        </button>

        <button onClick={() => setTab("assign")} className={tab==="assign" ? "active" : ""}>
          🔗 Asignar
        </button>
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
            <h2>Crear Rutina</h2>
              <input placeholder="Nombre"
                value={routineForm.name}
                onChange={e => setRoutineForm({ ...routineForm, name: e.target.value })} />
      
            {days.map((day, i) => (
              <div className="" key={i}>
                <h3>{day.day}</h3>

              {day.exercises.map((ex, j) => (
                <div key={j} >

                  <select
                    onChange={(e) =>
                      updateExercise(i, j, "exercise", e.target.value)
                    }
                  >
                    <option>
                    Ejercicios
                    </option>
                    <div>

                    {exercises.map(e => (
                      <option key={e._id} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                    </div>
                  </select>

                  <input
                    type="number"
                    placeholder="Sets"
                    onChange={(e) =>
                      updateExercise(i, j, "sets", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    placeholder="Reps"
                    onChange={(e) =>
                      updateExercise(i, j, "reps", e.target.value)
                    }
                  />
                </div>
              ))}

              <button onClick={() => addExercise(i)}>
                + Ejercicio
              </button>
              </div>
            ))}

              <button onClick={addDay}>+ Día</button>
              <button onClick={createRoutine}>Crear rutina</button>
              
          {/* ****************************** */}


            <div className="">
              <h2>Rutinas existentes</h2> 
              <select onChange={(e) => setSelectedRoutine(e.target.value)}>
                <option value="">Selecciona una rutina</option>
                {routines.map(r => (          
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
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