import { useEffect, useState } from "react";
import api from "./services/api";
import Layout from "../components/Layout";
import ProgressChart from "../components/ProgressChart";

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
    setClients(res.data);
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
            <div style={{ padding: 20 }}>
            <h1>Panel Coach</h1>

            {/* 👥 CLIENTES */}
            <h2>Mis Clientes</h2>
            {clients.map(c => (
                <div key={c._id}>
                {c.name} → {c.routine?.name || "Sin rutina"}
                <button onClick={() => fetchClientProgress(c._id)}>
                  Ver progreso
                </button>
                
                </div>
                
            ))}
            {selectedClientProgress.length > 0 && (
                <div>
                  <h3>Progreso</h3>
                  {selectedClientProgress.map((p, i) => (
                    <p key={i}>
                      {p.exercise} - {p.weight}kg x {p.reps}
                    </p>
                  ))}
                  {Object.keys(grouped).map((exercise) => (
                  <div className="card" key={exercise}>
                    <h3>{exercise}</h3>
                    <ProgressChart data={grouped[exercise].sort((a, b) => new Date(a.date) - new Date(b.date))} />
                  </div>
                  ))}
                </div>
              )}
            <hr />

            {/* 🏋️ CREAR RUTINA */}
            <h2>Crear Rutina</h2>
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
                placeholder="Ejercicios (ej: pecho, espalda, piernas)"
                value={routineForm.exercises}
                onChange={e => setRoutineForm({ ...routineForm, exercises: e.target.value })}
                />
            <button onClick={createRoutine}>Crear rutina</button>

            <hr />

            {/* 🔗 ASIGNAR */}
            <h2>Asignar Rutina</h2>

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
        </Layout>
  );
}