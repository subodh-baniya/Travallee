import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import Loader from "../src/components/Loader";

const ProtectedRoute = () => {
  const auth = useAuth();

  if (!auth) {
    return <Loader />;
  }

  const { isAuthenticated, authChecked } = auth;

  if (!authChecked) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
