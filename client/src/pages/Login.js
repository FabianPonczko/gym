import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { getUserFromToken } from "../utils/auth";
import "./login.css";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
        if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "coach") {
        navigate("/coach");
      } else if (!user.onboardingCompleted) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true)

      const res = await api.post("/auth/login", {
      name,
      password

    });

    localStorage.setItem("token", res.data.token);

    // 🔥 traer usuario real desde DB
    const resUser = await api.get("/users/me");
    const user = resUser.data;

    if (user.role === "Admin") {
      navigate("/admin");
    } else if (user.role === "coach") {
      navigate("/coach");
    } else if (!user.onboardingCompleted) {
      navigate("/onboarding");
    } else {
      navigate("/dashboard");
    }

  } catch (err){
    setError(err.response.data)
  }finally{
    setLoading(false)
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        
        <form
        onSubmit={handleLogin}
        >
        <h1 className="logo">🏋️ GymApp</h1>
        <p className="subtitle">Bienvenido de nuevo</p>

        <input
          type="name"
          placeholder="Nombre"
          onChange={e => setName(e.target.value)}
          className={error ? "input error" : "input"}
          />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          className={error ? "input error" : "input"}
          />

        {error && <p className="error-text">{error}</p>}

        <button disabled={loading}>
          {loading ? "Entrando..." : "Ingresar"}
        </button>
        </form>
      </div>
    </div>
  );
}