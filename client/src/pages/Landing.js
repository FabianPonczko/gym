import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { getUserFromToken } from "../utils/auth";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)
  
  // Si el usuario ya está logueado, redirigirlo a su dashboard
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
      } else {
      setIsLoading(false); // 3. Si no hay usuario, dejamos de cargar y mostramos la landing
      }
      
    }, [navigate]);

   
  if (isLoading) {
    return null; // O podés poner un <div>Cargando...</div>
  }


  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <h1>Transformá tu entrenamiento 💪</h1>
        <p>
          Seguimiento inteligente de rutinas, progreso automático
          y recomendaciones como un entrenador real.
        </p>

        <div className="hero-buttons">
          <button onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
          <button className="secondary" onClick={() => navigate("/register")}>
            Crear cuenta
          </button>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="features">
        <div className="card">
          <h3>📊 Seguimiento real</h3>
          <p>Registrá pesos y progresá semana a semana</p>
        </div>

        {/* <div className="card">
          <h3>🤖 IA integrada</h3>
          <p>La app ajusta tu rutina automáticamente</p>
        </div> */}

        <div className="card">
          <h3>🏋️ Rutinas personalizadas</h3>
          <p>Asignadas por un coach profesional</p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="steps">
        <h2>Cómo funciona</h2>

        <div className="steps-grid">
          <div>
            <h4>1. Registrate</h4>
            <p>Creá tu cuenta en segundos</p>
          </div>

          <div>
            <h4>2. Entrená</h4>
            <p>Seguís tu rutina y registrás pesos</p>
          </div>

          {/* <div>
            <h4>3. Mejorá</h4>
            <p>La IA optimiza tu progreso automáticamente</p>
          </div> */}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta">
        <h2>Empezá hoy 🚀</h2>
        <button onClick={() => navigate("/register")}>
          Crear cuenta gratis
        </button>
      </section>

    </div>
  );
}