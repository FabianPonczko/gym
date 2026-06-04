import { Link } from "react-router-dom";
import "./sidebar.css";
import api from "../pages/services/api";
import { useEffect, useEffectEvent , useState} from "react";

export default function Sidebar() {
  const [usuario,setUsuario] = useState(null)
  
  let user = null;
  
  let usuarioLogin
  
  const userName = async () => {
    try {
       usuarioLogin = await api.get("users/me")
    } catch (error) {
      console.log("error",error)
    }finally{
      console.log("mando ",usuarioLogin?.data?.name)
      setUsuario(usuarioLogin?.data?.name)
    }
  }

  try {
    const token = localStorage.getItem("token");
    if (token) user = JSON.parse(atob(token.split(".")[1]));
  } catch {}
  
  !usuario && userName()

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