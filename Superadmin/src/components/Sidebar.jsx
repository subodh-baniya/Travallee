import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";

const NAV = [
  { section: "Main" },
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    id: "hotels", icon: Building2, label: "Hotels",
    children: [
      { id: "register", label: "Register Hotels" },
      { id: "bookings", label: "Bookings" },
      { id: "status",   label: "Status" },
    ],
  },
  { id: "analysis", icon: BarChart3, label: "Analysis" },
];

const hotelPages = ["register","bookings","status"];

const pathMap = {
  dashboard: "/dashboard",
  register: "/dashboard/hotels/register",
  bookings: "/dashboard/hotels/bookings",
  status: "/dashboard/hotels/status",
  analysis: "/dashboard/analysis",
};

export default function Sidebar({ mini, setMini }) {
  const navigate = useNavigate();
  const location = useLocation();

  const page = useMemo(() => {
    const currentPath = location.pathname;
    const matchedKey = Object.keys(pathMap).find((key) => pathMap[key] === currentPath);
    return matchedKey || "dashboard";
  }, [location.pathname]);

  const [hotelsOpen, setHotelsOpen] = useState(hotelPages.includes(page));

  const handleSubClick = (id) => {
    navigate(pathMap[id]);
    setMini(true);
  };

  const handleTopClick = (item) => {
    if (item.children) {
      setHotelsOpen((o) => !o);
    } else {
      navigate(pathMap[item.id]);
      setMini(true);
    }
  };

  const isActive = (item) => {
    if (item.children) return item.children.some((c) => c.id === page);
    return page === item.id;
  };

  return (
    <div className={`flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden shrink-0 relative ${mini ? "w-16" : "w-64"}`}>

      {/* Header with Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100">
        {!mini ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/Logo.png"
                alt="Travallee"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900">Travallee</div>
              <div className="text-xs text-slate-500">Admin Panel</div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto">
            <img
              src="/Logo.png"
              alt="Travallee"
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
      </div>

      {/* Expand button — only visible when mini */}
      {mini && (
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-1/2 -right-3 -translate-y-1/2 z-50 w-6 h-12 bg-white border border-slate-200 rounded-r-lg flex items-center justify-center text-slate-400 cursor-pointer shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
          onClick={() => setMini(false)}
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </motion.button>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden space-y-1">
        {NAV.map((item, i) => {
          if (item.section) {
            return (
              <div 
                className={`text-xs tracking-widest text-slate-400 uppercase px-3 py-2 font-semibold transition-opacity duration-150 ${mini ? "opacity-0 h-0 p-0" : "opacity-100"}`} 
                key={i}
              >
                {item.section}
              </div>
            );
          }

          const open = item.id === "hotels" ? hotelsOpen : false;
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <div key={item.id}>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => handleTopClick(item)}
                title={mini ? item.label : ""}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!mini && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.children && (
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} className="text-slate-400" />
                      </motion.div>
                    )}
                  </>
                )}
              </motion.button>

              {item.children && (
                <motion.div
                  initial={false}
                  animate={{ height: open && !mini ? "auto" : 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {item.children.map((c) => {
                    const isSubActive = page === c.id;
                    return (
                      <motion.button
                        key={c.id}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-2 py-2 pr-3 pl-10 text-xs rounded-lg transition-all duration-150 ${
                          isSubActive
                            ? "text-blue-600 bg-blue-50 font-medium"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                        onClick={() => handleSubClick(c.id)}
                      >
                        <motion.div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            isSubActive ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        />
                        {c.label}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-3 border-t border-slate-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors duration-150"
          title={mini ? "Super Admin" : ""}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            SA
          </div>
          {!mini && (
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-semibold text-slate-900">Super Admin</div>
              <div className="text-[10px] text-slate-500">Administrator</div>
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}