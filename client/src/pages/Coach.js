import { useEffect, useState } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";
import "./coach.css";

export default function Coach() {
  const [clients, setClients] = useState([]);
  const [routines, setRoutines] = useState([]);

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


useEffect(() => {
    fetchClients();
    fetchRoutines();
  }, []);

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

        {!selectedClientName ? (
          <h2>Seleccioná un cliente</h2>
        ) : (
          <>
            <div className="coach-header">
              <h2>{selectedClientName}</h2>
            </div>

            {/* GRÁFICOS */}
            <div className="grid">
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

            {/* CREAR RUTINA */}
            <div className="card">
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
            </div>

            {/* ASIGNAR */}
            <div className="card">
              <h3>Asignar rutina</h3>

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
            </div>
          </>
        )}

      </div>
    </div>
  </Layout>
);
}