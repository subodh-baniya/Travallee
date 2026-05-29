// src/pages/Hotels/RegisterHotels.jsx
const hotels = [
  { emoji: "🏨", name: "Grand Vista Hotel", stars: "4 star", rooms: "120 rooms", owner: "Rohan Sharma", location: "Kathmandu", date: "May 25, 2026", status: "pending"  },
  { emoji: "🏩", name: "Sunrise Inn",        stars: "3 star", rooms: "45 rooms",  owner: "Priya Thapa",  location: "Pokhara",   date: "May 24, 2026", status: "pending"  },
  { emoji: "🏦", name: "Lake View Resort",   stars: "5 star", rooms: "200 rooms", owner: "Anil KC",      location: "Chitwan",   date: "May 22, 2026", status: "active"   },
  { emoji: "🏠", name: "Mountain Breeze",    stars: "3 star", rooms: "30 rooms",  owner: "Sita Rai",     location: "Nagarkot",  date: "May 20, 2026", status: "declined" },
];

const badgeMap = {
  pending:  { cls: "b-pending",  label: "Pending"  },
  active:   { cls: "b-active",   label: "Accepted" },
  declined: { cls: "b-declined", label: "Declined" },
};

export default function RegisterHotels() {
  return (
    <>
      <div className="section-title">Hotel Registration Requests</div>
      <div className="section-sub">Review and approve or decline incoming hotel registrations</div>

      <div className="search-bar">
        <input className="search-input" placeholder="Search hotels..." />
        <button className="btn">Filter</button>
        <button className="btn primary">+ Register Hotel</button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => {
              const b = badgeMap[h.status];
              return (
                <tr key={h.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="hotel-av">{h.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{h.name}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{h.stars} · {h.rooms}</div>
                      </div>
                    </div>
                  </td>
                  <td>{h.owner}</td>
                  <td>{h.location}</td>
                  <td style={{ color: "#64748b" }}>{h.date}</td>
                  <td><span className={`badge ${b.cls}`}>{b.label}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {h.status === "pending" && (
                        <>
                          <button className="mini-btn accept">Accept</button>
                          <button className="mini-btn decline">Decline</button>
                        </>
                      )}
                      {h.status === "active" && (
                        <button className="mini-btn decline">Revoke</button>
                      )}
                      {h.status === "declined" && (
                        <button className="mini-btn accept">Reconsider</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}