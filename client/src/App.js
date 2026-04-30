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
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        {/* landing */}
      <Route path="/" element={<Landing />} />
      
        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />
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