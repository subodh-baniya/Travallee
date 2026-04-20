import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontext"


const Dashboard = () => {

  const navigateto=useNavigate()
  const auth=useAuth();
  if(!auth){
    return null;
  }
  const {user,logout}=auth;

  const loggingout=()=>{
logout();
navigateto('/login',{replace:true});
  }

  return (
    <div>
      <p>{user?.Username}</p>
      <button onClick={()=>{loggingout()}}>logout</button>
    </div>

    
  )
}

export default Dashboard
