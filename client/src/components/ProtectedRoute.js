import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth"

export default function ProtectedRoute({ children, roles }) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}