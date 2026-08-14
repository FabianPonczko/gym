import { Link } from "react-router-dom";
import "./sidebar.css";
import api from "../pages/services/api";
import { useEffect, useEffectEvent , useState} from "react";

export default function Sidebar() {
  
  const [usuario,setUsuario] = useState(null)
  const [user, setUser] = useState(null);
  
  // 1. Obtener los datos del token solo una vez al montar
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      }
    } catch (error) {
      console.error("Error al decodificar token", error);
    }
  }, []);
  
  // 2. Hacer la petición a la API de forma controlada una sola vez
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await api.get("users/me");
        setUsuario(response.data?.name);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    };

    fetchUserName();
  }, []); // El array vacío asegura que solo se ejecute al cargar el componente


  // try {
  //   const token = localStorage.getItem("token");
  //   if (token) user = JSON.parse(atob(token.split(".")[1]));
  // } catch {}
  
  // !usuario && userName()

  return (
    // <div className="sidebar">
    <>
    <h2>🏋️ GymApp</h2>

      <Link to="/dashboard">Dashboard</Link>
      <span style={{color:"#94a3b8"}}>{usuario}</span>

      {user?.role === "Admin" && (
        <Link to="/admin">Admin</Link>
      )}

      {user?.role === "coach" && (
        <Link to="/coach">Coach</Link>
      )}

      <button onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}>
        Logout
      </button>
      </>
    // </div>
  );
}