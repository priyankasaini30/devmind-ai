import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // avoid flashing a redirect before auth state loads

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default PrivateRoute;