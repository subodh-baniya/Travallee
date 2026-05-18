import { createContext } from 'react'
import { useContext } from 'react';


export type user={
  Username:string,
  id:string,
  role:string,
  token:string,
  isHotelOwner?:boolean
}

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (form: { Username: string; password: string }) => Promise<user>;
  logout: () => Promise<void>;
  user: user|null;
  refreshUser: () => Promise<void>;
  authChecked:boolean;
  isHotelOwner:boolean;
}

export const Authcontext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(Authcontext);
  return context;
};
