import Sidebar from "./Sidebar";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        {children}
      </div>
    </div>
  );
}