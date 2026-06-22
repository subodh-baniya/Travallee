import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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

  // ✅ Track which user ID the socket was opened for
  const socketUserIdRef = useRef(null);

  const isAuthenticated = Boolean(user?.token && user?.role === ROLE_SUPERADMIN);

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const connectSocket = useCallback((token, superAdminId) => {
    // ✅ Key guard: don't reconnect if already connected for the same user
    if (
      socketRef.current?.connected &&
      socketUserIdRef.current === superAdminId
    ) {
      return;
    }

    // Disconnect any existing socket first
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      socketUserIdRef.current = null;
    }

    const socket = io("http://localhost:4001", {
      auth: { token },
      query: { SuperAdminId: String(superAdminId) },
      path: "/api/v1/admin/socket.io",
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socketUserIdRef.current = superAdminId; // ✅ Mark who this socket belongs to

    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Socket connected with ID:", socket.id);
      setSocketConnected(true);
    });

    socket.on("connect_error", () => {
      setSocketConnected(false);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      setSocketId(null);
    });
  }, []); // ✅ stable — no dependencies

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      socketUserIdRef.current = null;
    }
    setSocketConnected(false);
    setSocketId(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const cached = getStoredSession();
      try {
        const response = await getProfileApi();
        const profile = response?.data;

        if (profile?.role === ROLE_SUPERADMIN) {
          const merged = {
            ...cached,
            ...profile,
            role: ROLE_SUPERADMIN,
            id: profile?._id || cached?.id || "",
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
    return () => disconnectSocket();
  }, []);

  const userId = user?.id;
  const userToken = user?.token;

  useEffect(() => {
    if (authChecked && userToken && userId) {
      connectSocket(userToken, userId);
    }
  }, [authChecked, userId, userToken, connectSocket]); 

  const login = async (form) => {
    const response = await loginApi(form);
    if (!response?.success) throw new Error(response?.message);

    const payload = response?.data;
    if (payload?.role !== ROLE_SUPERADMIN) throw new Error("Access denied");

    const nextUser = {
      name: payload?.name || "Super Admin",
      email: payload?.email || "",
      role: payload?.role,
      token: payload?.token || "",
      id: payload?.id,
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
    <Authcontext.Provider value={value}>{children}</Authcontext.Provider>
  );
};