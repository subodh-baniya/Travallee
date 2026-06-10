import { useEffect, useMemo, useState } from "react";
import { Authcontext } from "./Authcontext";
import { getProfileApi, loginApi, logoutApi } from "../Services/auth.api";
import { AUTH_STORAGE_KEY, ROLE_SUPERADMIN } from "../Types/auth.types";

const getStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
};

export const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const isAuthenticated = Boolean(user?.token && user?.role === ROLE_SUPERADMIN);

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const cached = getStoredSession();
      if (cached?.token && cached?.role === ROLE_SUPERADMIN) {
        setUser(cached);
      }

      try {
        const response = await getProfileApi();
        const profile = response?.data;

        if (profile?.role === ROLE_SUPERADMIN) {
          const merged = {
            ...cached,
            ...profile,
            role: ROLE_SUPERADMIN,
            token: cached?.token || profile?.token || "",
          };
          setUser(merged);
          persistUser(merged);
        } else {
          setUser(null);
          persistUser(null);
        }
      } catch {
        setUser(null);
        persistUser(null);
      } finally {
        setAuthChecked(true);
      }
    };

    initAuth();
  }, []);

  const login = async (form) => {
    const response = await loginApi(form);

    if (!response?.success) {
      throw new Error(response?.message || "Login failed");
    }

    const payload = response?.data || {};

    if (payload?.role !== ROLE_SUPERADMIN) {
      throw new Error("Access denied. Superadmin account required.");
    }

    const nextUser = {
      name: payload?.name || "Super Admin",
      email: payload?.email || "",
      role: payload?.role,
      token: payload?.token || "",
    };

    setUser(nextUser);
    persistUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      persistUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      authChecked,
    }),
    [user, isAuthenticated, authChecked]
  );

  return <Authcontext.Provider value={value}>{children}</Authcontext.Provider>;
};
