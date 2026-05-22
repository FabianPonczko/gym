import { useState } from "react";


export function Navbar({
    handleTabChange,
    setOpenAdmin,
    openAdmin,
    tab
}){


return(

    <div>

        {/* Navbar */}
        
        <button style={{ visibility: openAdmin ? "hidden" : "visible"}}
        className="menu-admin-btn"
        onClick={() =>
            setOpenAdmin(!openAdmin)
        }
        >
        ☰
        </button>
        
        <div
        className={`sidebarAdmin ${
            openAdmin ? "open" : ""
        }`}
        >
            
            <h2>🏋️ Admin</h2>
            
            <button
            onClick={() =>
                handleTabChange("users")
            }
            className={
                tab === "users"
                ? "active"
                : ""
                }
                >
            👤 Usuarios
            </button>
            
            <button
            onClick={() =>
                handleTabChange("routines")
            }
            className={
                tab === "routines"
                ? "active"
                : ""
            }
            >
            🏋️ Rutinas
            </button>
            
            <button
            onClick={() =>
                handleTabChange("assign")
            }
            className={
                tab === "assign"
                ? "active"
                : ""
            }
            >
            🔗 Asignar
            </button>
            
            <button style={{
                margintop: "auto", 
                padding: "10px", 
                background: "#ef4444",
                border: "none",
                color: "white",
                cursor: "pointer"
            }}
            onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
            }}>
            Logout
            </button>

        </div>
    </div>
)
    
}