import { useState } from "react";

const NAV = [
  { section: "Main" },
  {
    id: "app", icon: "ti-device-mobile", label: "App",
    children: [
      { id: "banners", label: "Banners" },
      { id: "redeem",  label: "Redeem Code" },
      { id: "users",   label: "Users" },
      { id: "block",   label: "Block" },
    ],
  },
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

const appPages   = ["banners","redeem","users","block"];
const hotelPages = ["register","bookings","status"];

export default function Sidebar({ page, setPage, mini, setMini }) {
  const [appOpen,    setAppOpen]    = useState(appPages.includes(page));
  const [hotelsOpen, setHotelsOpen] = useState(hotelPages.includes(page));

  const handleSubClick = (id) => {
    setPage(id);
    setMini(true);
  };

  const handleTopClick = (item) => {
    if (item.children) {
      if (item.id === "app") {
        setAppOpen((o) => !o);
        setHotelsOpen(false);
      } else if (item.id === "hotels") {
        setHotelsOpen((o) => !o);
        setAppOpen(false);
      }
    } else {
      setPage(item.id);
      setMini(true);
    }
  };

  const isActive = (item) => {
    if (item.children) return item.children.some((c) => c.id === page);
    return page === item.id;
  };

  return (
    <div className={`sidebar${mini ? " mini" : ""}`}>
      <div className="s-logo">
        <div className="s-logo-icon">
          <i className="ti ti-shield-lock" aria-hidden="true" />
        </div>
        <div>
          <div className="s-logo-name">Control Center</div>
          <div className="s-logo-sub">Superadmin</div>
        </div>
      </div>

      <nav className="s-nav">
        {NAV.map((item, i) => {
          if (item.section) return <div className="s-section" key={i}>{item.section}</div>;

          const open = item.id === "app" ? appOpen : item.id === "hotels" ? hotelsOpen : false;

          return (
            <div key={item.id}>
              <div
                className={`s-item${isActive(item) ? " active" : ""}`}
                onClick={() => handleTopClick(item)}
              >
                <div className="s-icon">
                  <i className={`ti ${item.icon}`} aria-hidden="true" />
                </div>
                <span className="s-label">{item.label}</span>
                {item.children && (
                  <i className={`ti ti-chevron-down s-chevron${open ? " open" : ""}`} aria-hidden="true" />
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