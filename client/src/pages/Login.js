import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { getUserFromToken } from "../utils/auth";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "coach") navigate("/coach");
      else navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      return setError("Completá todos los campos");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      const user = getUserFromToken();

if (!user.onboardingCompleted) {
  navigate("/onboarding");
} else if (user.role === "admin") {
  navigate("/admin");
} else if (user.role === "coach") {
  navigate("/coach");
} else {
  navigate("/dashboard");
}
      // if (user.role === "admin") navigate("/admin");
      // else if (user.role === "coach") navigate("/coach");
      // else navigate("/dashboard");

    } catch (err) {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="logo">🏋️ GymApp</h1>
        <p className="subtitle">Bienvenido de nuevo</p>

        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          className={error ? "input error" : "input"}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          className={error ? "input error" : "input"}
        />

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Ingresar"}
        </button>

      </div>
    </div>
  );
}