import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/Authcontext";
import { motion } from "framer-motion";

const Topbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth) return null;

  const { user, logout } = auth;

  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm">

      <div className="flex items-center">
        <span className="text-base font-bold text-gray-800 tracking-wide">
          Dashboard
        </span>
      </div>

      <div className="flex items-center gap-5">

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
        >
          {user?.Username}
        </motion.div>

        <motion.button
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition"
        >
          Logout
        </motion.button>

      </div>
    </header>
  );
};

export default Topbar;