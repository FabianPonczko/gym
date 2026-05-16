import Sidebar from "./Sidebar";
import { useState,useEffect } from "react";
import "./layout.css";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

   useEffect(() => {

    if (open) {

      const timer =
        setTimeout(() => {

          setOpen(false);

        }, 4000);

      return () =>
        clearTimeout(timer);
    }

  }, [open]);

  return (
    <div className="app">
      <button
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