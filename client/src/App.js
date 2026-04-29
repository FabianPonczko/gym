// import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Admin from "./pages/Admin";
// import Coach from "./pages/Coach";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/coach" element={<Coach />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Coach from "./pages/Coach";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* login */}
        <Route path="/" element={<Login />} />

        {/* cliente */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["client"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* coach */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute roles={["coach"]}>
              <Coach />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
           
              <Register />
            
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;