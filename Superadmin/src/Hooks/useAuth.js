import { useAuthContext } from "../Contexts/Authcontext";

export const useAuth = () => {
  return useAuthContext();
};
