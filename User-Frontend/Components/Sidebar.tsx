import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { name: "Overview", path: "/dashboard" },
  { name: "Bookings", path: "/dashboard/bookings" },
  { name: "Rooms", path: "/dashboard/rooms" },
  { name: "Pricing", path: "/dashboard/pricing" },
  { name: "Guests", path: "/dashboard/guests" },
  { name: "Payments", path: "/dashboard/payments" },
  { name: "Reports", path: "/dashboard/reports" },
  { name: "Settings", path: "/dashboard/settings" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white flex flex-col shadow-sm">

      <div className="h-20 flex items-center px-6">
        <div className="text-2xl font-bold tracking-wide">
          <span className="bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Travallee
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            className="relative flex items-center px-4 py-2 rounded-lg text-sm transition"
          >
            {({ isActive }) => (
              <>
                {/* Active background*/}
                {isActive && (
                  <motion.div
                    layoutId="active-bg"
                    className="absolute inset-0 rounded-lg bg-blue-50"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Left indicator*/}
                {isActive && (
                  <motion.div
                    layoutId="active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-blue-600 rounded-r"
                  />
                )}

                {/* Text */}
                <motion.span
                  className={`relative z-10 ${
                    isActive
                      ? "text-blue-700 font-medium"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  animate={{ x: isActive ? 4 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  whileHover={{ x: 3 }}
                >
                  {item.name}
                </motion.span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;