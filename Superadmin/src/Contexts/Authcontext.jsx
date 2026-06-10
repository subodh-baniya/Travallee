import { createContext, useContext } from "react";

export const Authcontext = createContext(null);

export const useAuthContext = () => {
  return useContext(Authcontext);
};
