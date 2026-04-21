import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontext";
import {Loader} from "../Components/Loader"

const Publicroute = () => {
  const auth = useAuth();

  if (!auth) return <Loader />;

  const { isAuthenticated, authChecked } = auth;

  if (!authChecked) return <Loader />;

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Outlet />
  );
};

export default Publicroute;