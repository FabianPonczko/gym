import Sidebar from "./Sidebar";
import { useState,useEffect } from "react";
import "./layout.css";
import { Navbar } from "./Navbar";

export default function Layout({ children,visible=false }) {
  const [open, setOpen] = useState(false);

   useEffect(() => {

    if (open) {
      
      const timer =
        setTimeout(() => {

          setOpen(false);

        }, 3000);

      return () =>
        clearTimeout(timer);
    }

  }, [open]);

 
  
  
  return (

    <div className="app">
      <button style={{ visibility: open || visible? "hidden" : "visible" }}
        className="menu-btn"
        onClick={() => setOpen(!open)}
        > 
        ☰
      </button>
      
      <div
        className={`sidebar ${ open ? "open" : "" }`}>
        <Sidebar />
      </div>
      
      <div className="main">
        {children}
      </div>
    </div>
  );
}