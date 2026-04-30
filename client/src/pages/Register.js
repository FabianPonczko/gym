import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import "./login.css"; // reutilizamos estilos

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("Completá todos los campos");
    }

    if (form.password !== form.confirm) {
      return setError("Las contraseñas no coinciden");
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      navigate("/login");

    } catch (err) {
      setError("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo">🚀 Crear cuenta</h1>
        <p className="subtitle">Empezá tu progreso hoy</p>

        <input
          placeholder="Nombre"
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={error ? "input error" : "input"}
        />

        <input
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
          className={error ? "input error" : "input"}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
          className={error ? "input error" : "input"}
        />

        <input
          type="password"
          placeholder="Confirmar password"
          onChange={e => setForm({ ...form, confirm: e.target.value })}
          className={error ? "input error" : "input"}
        />

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <p
          style={{ marginTop: 15, cursor: "pointer", color: "#38bdf8" }}
          onClick={() => navigate("/login")}
        >
          Ya tengo cuenta
        </p>

      </div>
    </div>
  );
}