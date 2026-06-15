import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, LogOut, Plus, Save } from "lucide-react";

const PAGE_META = {
  "/dashboard": { title: "Dashboard", icon: "📊", path: "dashboard" },
  "/dashboard/hotels/register": { title: "Register Hotels", icon: "🏨", path: "hotels/register" },
  "/dashboard/hotels/bookings": { title: "Bookings", icon: "📅", path: "hotels/bookings" },
  "/dashboard/hotels/status": { title: "Hotel Status", icon: "✓", path: "hotels/status" },
  "/dashboard/analysis": { title: "Analysis", icon: "📈", path: "analysis" },
};

export default function Topbar({ mini, setMini, onSave, savedMsg, onLogout }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: "Dashboard", path: "dashboard" };
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });

  return (
    <header className="bg-white border-b border-slate-200 py-3 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={() => setMini(!mini)}
          title="Toggle sidebar"
        >
          <Menu size={16} className="text-slate-600" />
        </motion.button>
        
        <div>
          <h1 className="text-base font-semibold text-slate-900">{meta.title}</h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">{meta.path}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 px-3 py-1 rounded-lg bg-slate-50">
          {today}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus size={16} />
            <span>New</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          className={`py-2 px-4 rounded-lg text-sm font-semibold cursor-pointer border transition-all flex items-center gap-2 ${
            savedMsg
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Save size={16} />
          <span>{savedMsg ? "Saved" : "Save"}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
          className="py-2 px-4 rounded-lg text-sm font-medium cursor-pointer border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </motion.button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
          SA
        </div>
      </div>
    </header>
  );
}