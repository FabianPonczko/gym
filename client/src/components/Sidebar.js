import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  let user = null;

  try {
    const token = localStorage.getItem("token");
    if (token) user = JSON.parse(atob(token.split(".")[1]));
  } catch {}

  return (
    <div className="sidebar">
      <h2>🏋️ GymApp</h2>

      <Link to="/dashboard">Dashboard</Link>

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
    </div>
  );
}