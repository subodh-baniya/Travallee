import {useAuth} from "../Contexts/Authcontext"
import {Outlet} from "react-router-dom"
import {Navigate} from "react-router-dom"
import {Loader} from "../Components/Loader"

const ProtectedRoute = () => {

  const auth=useAuth()

  if(!auth){
    return <Loader/>;
  }

  const {isAuthenticated,loading}=auth;

  if(loading){
    return <Loader/>;
  }

 return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

export default ProtectedRoute
