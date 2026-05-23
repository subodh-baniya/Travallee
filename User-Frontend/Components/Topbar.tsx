import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/Authcontext";
import { motion } from "framer-motion";
import { FiBell, FiMenu } from "react-icons/fi";
import { io, Socket } from "socket.io-client";

interface TopbarProps {
  onToggleSidebar: () => void;
}

type PanelNotification = {
  bookingId?: string;
  title: string;
  message: string;
  createdAt: string;
};

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const auth = useAuth();
  const [notifications, setNotifications] = useState<PanelNotification[]>([]);
  const [openNotifications, setOpenNotifications] = useState(false);

  if (!auth) return null;

  const { user, logout, hotelId } = auth;
  const displayName = user?.Name || user?.Username || "User";

  useEffect(() => {
    if (!hotelId) {
      return;
    }

    const socket: Socket = io(import.meta.env.VITE_API_BASE_URL_ADMIN || "http://localhost:4001", {
      path: "/api/v1/admin/socket.io",
      query: { HotelId: hotelId },
      withCredentials: true,
      transports: ["websocket"],
    });

    const handlePanelNotification = (payload: any) => {
      const nextNotification: PanelNotification = {
        bookingId: payload.bookingId,
        title: payload.title || "New booking confirmed",
        message: payload.message || "A new booking has been confirmed.",
        createdAt: payload.createdAt || new Date().toISOString(),
      };

      setNotifications((prev) => [nextNotification, ...prev].slice(0, 15));
    };

    socket.on("booking_notification", handlePanelNotification);

    return () => {
      socket.off("booking_notification", handlePanelNotification);
      socket.disconnect();
    };
  }, [hotelId]);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        className="flex flex-col justify-center gap-0.75 w-8 h-8"
      >
            <FiMenu size={20} />
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-4">

        <div className="relative">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenNotifications((prev) => !prev)}
            className="relative p-2 rounded-md border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all"
          >
            <FiBell size={16} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] leading-[18px] text-center">
                {notifications.length}
              </span>
            )}
          </motion.button>

          {openNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 text-sm font-semibold text-slate-800">
                Notifications
              </div>
              <div className="max-h-72 overflow-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-slate-500">No notifications yet.</div>
                ) : (
                  notifications.map((item, index) => (
                    <div key={`${item.bookingId || "booking"}-${index}`} className="px-4 py-3 border-b border-slate-100 last:border-b-0">
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <motion.div
          whileHover={{ y: -1 }}
          className="
            px-3 py-1.5 rounded-full
            bg-blue-50 text-blue-600
            text-xs font-medium
            border border-blue-100
          "
        >
          Hello, {displayName}
        </motion.div>

        <motion.button
          onClick={async () => {
            window.location.href="/initialhome/herosection"
              await logout();
              }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="
            px-3 py-1.5 text-xs font-medium
            rounded-md
            text-slate-600
            border border-slate-200
            hover:border-blue-200 hover:text-blue-600
            transition-all
          "
        >
          Logout
        </motion.button>

      </div>
    </header>
  );
};

export default Topbar;