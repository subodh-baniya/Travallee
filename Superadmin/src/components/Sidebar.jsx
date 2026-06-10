import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NAV = [
  { section: "Main" },
  { id: "dashboard", icon: "ti-layout-dashboard", label: "Dashboard" },
  {
    id: "hotels", icon: "ti-building", label: "Hotels",
    children: [
      { id: "register", label: "Register Hotels" },
      { id: "bookings", label: "Bookings" },
      { id: "status",   label: "Status" },
    ],
  },
  { id: "analysis", icon: "ti-chart-bar", label: "Analysis" },
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
    <div className={`flex flex-col bg-white border-r border-brand-border transition-all duration-200 overflow-hidden shrink-0 relative ${mini ? "w-[58px] min-w-[58px]" : "w-[220px] min-w-[220px]"}`}>

      {/* Expand button — only visible when mini */}
      {mini && (
        <button
          className="absolute top-1/2 left-[38px] -translate-y-1/2 z-[100] w-5 h-10 bg-white border border-l-0 border-brand-border2 rounded-r-lg flex items-center justify-center text-base text-brand-accent cursor-pointer shadow-[2px_0_6px_rgba(99,120,210,0.1)] transition-colors duration-150 font-bold hover:bg-brand-accentBg hover:text-[#0369a1]"
          onClick={() => setMini(false)}
          title="Expand sidebar"
        >
          ›
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 px-1.5 overflow-y-auto overflow-x-hidden">
        {NAV.map((item, i) => {
          if (item.section) {
            return (
              <div 
                className={`text-[9px] tracking-[0.13em] text-brand-accent2 uppercase pt-3 px-2 pb-1 whitespace-nowrap overflow-hidden transition-opacity duration-150 ${mini ? "opacity-0 h-0 p-0" : "opacity-100"}`} 
                key={i}
              >
                {item.section}
              </div>
            );
          }

          const open = item.id === "hotels" ? hotelsOpen : false;
          const active = isActive(item);

          return (
            <div key={item.id}>
              <div
                className={`group flex items-center gap-[9px] py-2.25 px-2 rounded-lg cursor-pointer text-[13px] text-slate-500 transition-all duration-150 mb-0.5 whitespace-nowrap overflow-hidden font-normal relative hover:bg-[#f0f9ff] hover:text-brand-accent ${active ? "bg-brand-accentBg text-brand-accent font-medium" : ""}`}
                onClick={() => handleTopClick(item)}
                title={mini ? item.label : ""}
              >
                <div className={`w-[30px] h-[30px] rounded-[7px] flex items-center justify-center shrink-0 text-[15px] transition-colors duration-150 ${active ? "bg-brand-accentLight text-[#0369a1]" : "bg-[#f0f9ff] text-brand-accent2 group-hover:bg-brand-accentLight"}`}>
                  <i className={`ti ${item.icon}`} aria-hidden="true" />
                </div>
                <span className="flex-1 overflow-hidden">{item.label}</span>
                {item.children && (
                  <i
                    className={`ti ti-chevron-down text-[11px] text-slate-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {item.children && (
                <div className={`overflow-hidden transition-all duration-200 ${open && !mini ? "max-h-[200px]" : "max-h-0"}`}>
                  {item.children.map((c) => {
                    const isSubActive = page === c.id;
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center gap-2 py-2 pr-2 pl-10 cursor-pointer text-xs text-slate-500 rounded-[7px] transition-all duration-150 mb-[1px] whitespace-nowrap hover:bg-[#f0f9ff] hover:text-brand-accent ${isSubActive ? "text-brand-accent bg-brand-accentBg font-medium" : ""}`}
                        onClick={() => handleSubClick(c.id)}
                      >
                        <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${isSubActive ? "bg-brand-accent" : "bg-brand-accentLight"}`} />
                        {c.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="py-2.5 px-1.5 border-t border-brand-border whitespace-nowrap overflow-hidden">
        <div className="flex items-center gap-[9px] p-2 rounded-lg bg-[#f0f9ff] cursor-pointer transition-colors duration-150 hover:bg-brand-accentBg">
          <div className="w-7 h-7 rounded-full bg-brand-accentLight flex items-center justify-center text-[10px] font-semibold text-[#0369a1] shrink-0">SA</div>
          {!mini && (
            <>
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-medium text-slate-900 truncate">Super Admin</div>
                <div className="text-[10px] text-slate-500 truncate">Root access</div>
              </div>
              <div className="w-[7px] h-[7px] rounded-full bg-[#4ade80] shrink-0 ml-1" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}