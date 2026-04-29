import {  useEffect,useState } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [routines, setRoutines] = useState([]);

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
  }, []);

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
  const createRoutine = async () => {
    try {
      const exercisesArray = routineForm.exercises.split(",").map(e => ({
        name: e.trim(),
        sets: 3,
        reps: 10
      }));

      await api.post("/routines", {
        name: routineForm.name,
        description: routineForm.description,
        exercises: exercisesArray
      });

      alert("Rutina creada 💪");
      setRoutineForm({ name: "", description: "", exercises: "" });
      fetchRoutines();
    } catch (err) {
        alert("Error creando rutina");
    }
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

   

  return (

    <Layout>

    <div style={{ padding: 20 }}>
      <h1>Panel Admin</h1>

      {/* 👤 CREAR USUARIO */}
      <h2>Crear Usuario</h2>
      <input
        placeholder="Nombre"
        value={userForm.name}
        onChange={e => setUserForm({ ...userForm, name: e.target.value })}
        />
      <input
        placeholder="Email"
        value={userForm.email}
        onChange={e => setUserForm({ ...userForm, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={userForm.password}
        onChange={e => setUserForm({ ...userForm, password: e.target.value })}
        />
        <input
        type="text"
        placeholder="client, coach"
        value={userForm.role}
        onChange={e => setUserForm({ ...userForm, role: e.target.value })}
        />
      <button onClick={createUser}>Crear</button>

      <hr />

      {/* 🏋️ CREAR RUTINA */}
      <h2>Crear Rutina</h2>
      <input
        placeholder="Nombre rutina"
        value={routineForm.name}
        onChange={e => setRoutineForm({ ...routineForm, name: e.target.value })}
        />
      <input
        placeholder="Descripción"
        value={routineForm.description}
        onChange={e => setRoutineForm({ ...routineForm, description: e.target.value })}
        />
      <input
        placeholder="Ejercicios (ej: pecho, espalda, piernas)"
        value={routineForm.exercises}
        onChange={e => setRoutineForm({ ...routineForm, exercises: e.target.value })}
      />
      <button onClick={createRoutine}>Crear rutina</button>

      <hr />

      {/* 🔗 ASIGNAR */}
      <h2>Asignar Rutina</h2>

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

      <hr />

      {/* 📋 LISTA */}
      <h2>Usuarios</h2>
      {users.map(u => (
        <div key={u._id}>
          {u.name} - {u.email} → {u.routine?.name || "Sin rutina"}
           
           <button onClick={() => fetchUserProgress(u._id, u.name)}>
              Ver progreso
            </button>
        </div>
      ))}
      {selectedUserProgress.length > 0 && (
        <div className="card">
        <h2>Progreso de {selectedUserName}</h2>
    {/* {selectedUserProgress.map((p, i) => (
      <p key={i}>
      {p.exercise} - {p.weight}kg x {p.reps} 
      ({new Date(p.date).toLocaleDateString()})
      </p>
      ))} */}
      {Object.keys(grouped).map((exercise) => (
  <div className="card" key={exercise}>
    <h3>{exercise}</h3>
    <ProgressChart data={grouped[exercise]} />
  </div>
))}
     
  </div>
)}
    </div>
      </Layout>
  );
}