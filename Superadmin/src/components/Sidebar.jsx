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
    <div className={`sidebar${mini ? " mini" : ""}`}>

      {/* Expand button — only visible when mini */}
      {mini && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setMini(false)}
          title="Expand sidebar"
        >
          ›
        </button>
      )}

      {/* Nav */}
      <nav className="s-nav">
        {NAV.map((item, i) => {
          if (item.section) return <div className="s-section" key={i}>{item.section}</div>;

          const open = item.id === "hotels" ? hotelsOpen : false;

          return (
            <div key={item.id}>
              <div
                className={`s-item${isActive(item) ? " active" : ""}`}
                onClick={() => handleTopClick(item)}
                title={mini ? item.label : ""}
              >
                <div className="s-icon">
                  <i className={`ti ${item.icon}`} aria-hidden="true" />
                </div>
                <span className="s-label">{item.label}</span>
                {item.children && (
                  <i
                    className={`ti ti-chevron-down s-chevron${open ? " open" : ""}`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {item.children && (
                <div className={`s-submenu${open ? " open" : ""}`}>
                  {item.children.map((c) => (
                    <div
                      key={c.id}
                      className={`s-sub-item${page === c.id ? " active" : ""}`}
                      onClick={() => handleSubClick(c.id)}
                    >
                      <div className="s-dot" />
                      {c.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="s-footer">
        <div className="s-user">
          <div className="s-av">SA</div>
          <div>
            <div className="s-uname">Super Admin</div>
            <div className="s-urole">Root access</div>
          </div>
          <div className="s-online" />
        </div>
      </div>
    </div>
  );
}