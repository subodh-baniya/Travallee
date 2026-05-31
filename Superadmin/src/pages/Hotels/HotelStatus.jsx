const hotels = [
  { emoji: "lol", name: "Grand Vista Hotel", loc: "Kathmandu · 4 star", active: true  },
  { emoji: "lol", name: "Sunrise Inn",        loc: "Pokhara · 3 star",   active: true  },
  { emoji: "lol", name: "Mountain Breeze",    loc: "Nagarkot · 3 star",  active: false },
  { emoji: "lol", name: "Lake View Resort",   loc: "Chitwan · 5 star",   active: true  },
  { emoji: "lol", name: "Heritage Palace",    loc: "Bhaktapur · 4 star", active: false },
  { emoji: "lol", name: "Green Valley Inn",   loc: "Bandipur · 3 star",  active: true  },
];

const active   = hotels.filter((h) => h.active).length;
const inactive = hotels.filter((h) => !h.active).length;

export default function HotelStatus() {
  return (
    <>
      <div className="section-title">Hotel Status</div>
      <div className="section-sub">Active and inactive hotels across the platform</div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Hotels</div>
          <div className="stat-val">{hotels.length}</div>
          <div className="stat-sub">Registered on platform</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: "#4ade80" }}>
          <div className="stat-label">Active</div>
          <div className="stat-val" style={{ color: "#166534" }}>{active}</div>
          <div className="stat-sub">Currently accepting bookings</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: "#f87171" }}>
          <div className="stat-label">Inactive</div>
          <div className="stat-val" style={{ color: "#991b1b" }}>{inactive}</div>
          <div className="stat-sub">Paused or under review</div>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="search-bar">
        <input className="search-input" placeholder="Search hotels..." />
        <select className="form-input" style={{ width: "auto", padding: "9px 14px" }}>
          <option>All hotels</option>
          <option>Active only</option>
          <option>Inactive only</option>
        </select>
      </div>

      {/* Hotel list */}
      {hotels.map((h) => (
        <div className="hotel-row" key={h.name}>
          <div
            className="hotel-indicator"
            style={{ background: h.active ? "#4ade80" : "#f87171" }}
          />
          <div className="hotel-av">{h.emoji}</div>
          <div>
            <div className="hotel-name">{h.name}</div>
            <div className="hotel-loc">{h.loc}</div>
          </div>
          <span
            className={`badge ${h.active ? "b-active" : "b-declined"}`}
            style={{ marginLeft: "auto" }}
          >
            {h.active ? "Active" : "Inactive"}
          </span>
          <button className="mini-btn neutral" style={{ marginLeft: 10 }}>
            {h.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </>
  );
}