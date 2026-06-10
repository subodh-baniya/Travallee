import { useEffect, useMemo, useState, useRef } from "react";
import { Authcontext } from "./Authcontext";
import { getProfileApi, loginApi, logoutApi } from "../Services/auth.api";
import { AUTH_STORAGE_KEY, ROLE_SUPERADMIN } from "../Types/auth.types";
import { io } from "socket.io-client";


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
  const [socketId, setSocketId] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef(null);

  const isAuthenticated = Boolean(
    user?.token && user?.role === ROLE_SUPERADMIN
  );

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const connectSocket = (token, superAdminId) => {

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = io("http://localhost:4001", {
      auth: {
        token,
      },
      query: {
        SuperAdminId: String(superAdminId),
      },
      path: "/api/v1/admin/socket.io",
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      setSocketId(socketRef.current.id);
      setSocketConnected(true);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocketConnected(false);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocketConnected(false);
    setSocketId(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const cached = getStoredSession();

      if (cached?.token && cached?.role === ROLE_SUPERADMIN) {
        setUser(cached);


        connectSocket(cached.token, cached.id);
      }

      try {
        const response = await getProfileApi();
        const profile = response?.data;
        

        if (profile?.role === ROLE_SUPERADMIN) {
          const merged = {
            ...cached,
            ...profile,
            role: ROLE_SUPERADMIN,
            id : profile?._id || cached?.id || "",
            token: cached?.token || profile?.token || "",
          };
          console.log("Profile loaded, merged user data:", merged);

          setUser(merged);
          persistUser(merged);

          connectSocket(merged.token, merged.id);
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


    return () => {
      disconnectSocket();
    };
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
      id: payload?._id,
    };

    setUser(nextUser);
    persistUser(nextUser);

 
    connectSocket(nextUser.token, nextUser.id);

    return nextUser;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      persistUser(null);

      disconnectSocket();
    }
  };


  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      authChecked,
      socketId,
      socketConnected,
      socket: socketRef.current,
    }),
    [user, isAuthenticated, authChecked, socketId, socketConnected]
  );

  return (
    <Authcontext.Provider value={value}>
      {children}
    </Authcontext.Provider>
  );
};