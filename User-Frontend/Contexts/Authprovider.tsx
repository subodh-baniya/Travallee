import React, { useEffect, useState } from 'react'
import { Authcontext } from './Authcontext'
import axios from "axios";
import type { user } from './Authcontext';

export const Authprovider = ({ children }: { children: React.ReactNode }) => {
  const [user,setUser]=useState<user | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setloading]=useState(true);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_AUTH_API_BASE_URL}/profile`,
        { withCredentials: true }
      );

      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }finally{
      setloading(false);
    }
  };

  fetchUser();
}, []);
  

  const login = async (form: { Username: string; password: string }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_AUTH_API_BASE_URL}/login`,
      form,
      { withCredentials: true }
    );

    setUser(res.data.data); 
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await axios.post( `${import.meta.env.VITE_AUTH_API_BASE_URL}/logout`,{}, { withCredentials: true })
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Authcontext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </Authcontext.Provider>
  )
}


