import React, { useEffect, useState } from 'react'
import { Authcontext } from './Authcontext'
import axios from "axios";
import type { user } from './Authcontext';

export const Authprovider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<user | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
          { withCredentials: true }
        );

        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    initAuth();
  }, []);

  const login = async (form: { Username: string; password: string }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/login`,
      form,
      { withCredentials: true }
    );

    setUser(res.data.data);
  };

  const logout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/logout`,
      {},
      { withCredentials: true }
    );

    setUser(null);
  };

  return (
    <Authcontext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        authChecked,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};


