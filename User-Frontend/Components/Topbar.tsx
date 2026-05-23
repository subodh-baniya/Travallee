import { useAuth } from "../Contexts/Authcontext";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";

interface TopbarProps {
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const auth = useAuth();
 if (!auth) return null;

  const { user, logout } = auth;
  const displayName = user?.Name || user?.Username || "User";

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
             await logout();
            window.location.href="/initialhome/herosection"
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