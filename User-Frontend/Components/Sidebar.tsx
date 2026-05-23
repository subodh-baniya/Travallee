import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../Contexts/Authcontext";
import { getHotelById } from "../Services/hotel.api";


interface SidebarProps {
  collapsed: boolean;
}

const sections = [
  {
    title: "MAIN",
    items: [
      { name: "Overview", path: "/dashboard/overview" },
      { name: "Bookings", path: "/dashboard/bookings" },
      { name: "Guests", path: "/dashboard/guests" }
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { name: "Rooms", path: "/dashboard/rooms" },
      { name: "Reviews", path: "/dashboard/reviews" },
      { name: "Messages", path: "/dashboard/messages" },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { name: "Finance", path: "/dashboard/finance" },
      { name: "Reports", path: "/dashboard/reports" },
      { name: "Settings", path: "/dashboard/settings" },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
    const [hotel,setHotel]=useState<any>();
    const auth=useAuth();
    const hotelId=auth?.hotelId;
    useEffect(()=>{

      const fetchHotel=async()=>{
        if(!hotelId){
          console.log("no hotel id found");
          return;
        }
       const res= await getHotelById(hotelId);
       setHotel(res?.data??res)
      }
     fetchHotel();

    },[hotelId])

  return (
    <aside
      className={`
        h-screen bg-white border-r border-slate-200
        transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
      `}
    >

      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-100">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <img
              src="/Logo.png"
              alt="Travallee logo"
              className="h-8 w-8 object-contain"
            />
            <div>
              <span className="text-lg font-semibold text-blue-600">
                Travallee
              </span>
              <div className="text-[10px] text-slate-800 tracking-widest">
                {hotel?.hotelName||"hotelName"}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-md border border-slate-200 overflow-hidden">
            <img src="/Logo.png" alt="Travallee logo" className="h-6 w-6 object-contain" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="px-2 py-4 space-y-6">

        {sections.map((section) => (
          <div key={section.title}>

            {!collapsed && (
              <div className="text-[14px] text-slate-900 px-3 mb-2 tracking-widest">
                {section.title}
              </div>
            )}

            <div className="space-y-1">

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex items-center px-3 py-2 rounded-md text-sm"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-blue-500 rounded"
                        />
                      )}

                      <motion.span
                        className={`
                          relative transition-all
                          ${isActive
                            ? "text-blue-600 font-medium"
                            : "text-slate-600 hover:text-slate-900"}
                        `}
                      >
                        {collapsed ? item.name[0] : item.name}
                      </motion.span>

                    </>
                  )}
                </NavLink>
              ))}

            </div>
          </div>
        ))}

      </nav>
    </aside>
  );
};

export default Sidebar;