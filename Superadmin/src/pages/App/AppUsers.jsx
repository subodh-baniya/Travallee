const users = [
  { initials:"AK", color:"#38bdf8", name:"Arjun K.",  email:"arjun@mail.com", joined:"Jan 12, 2025", lastActive:"2 min ago",   status:"active"   },
  { initials:"ST", color:"#818cf8", name:"Sita T.",   email:"sita@mail.com",  joined:"Mar 5, 2025",  lastActive:"1 hr ago",    status:"active"   },
  { initials:"PM", color:"#34d399", name:"Priya M.",  email:"priya@mail.com", joined:"Feb 20, 2025", lastActive:"32 days ago", status:"inactive" },
  { initials:"RB", color:"#f87171", name:"Raj B.",    email:"raj@mail.com",   joined:"Apr 1, 2025",  lastActive:"5 days ago",  status:"active"   },
  { initials:"NK", color:"#fbbf24", name:"Nita K.",   email:"nita@mail.com",  joined:"May 3, 2025",  lastActive:"45 days ago", status:"inactive" },
];

export default function AppUsers() {
  return (
    <>
      <div className="section-title">App Users</div>
      <div className="section-sub">All registered users — see active, inactive and last active time</div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-val">12,481</div><div className="stat-sub">Registered accounts</div></div>
        <div className="stat-card" style={{ borderTopColor:"#4ade80" }}><div className="stat-label">Active (24h)</div><div className="stat-val" style={{ color:"#166534" }}>1,204</div><div className="stat-sub">Online in last 24 hrs</div></div>
        <div className="stat-card" style={{ borderTopColor:"#94a3b8" }}><div className="stat-label">Inactive</div><div className="stat-val" style={{ color:"#64748b" }}>3,210</div><div className="stat-sub">No activity in 30 days</div></div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input className="search-input" placeholder="Search by name or email..." />
        <select className="form-input" style={{ width:"auto", padding:"9px 14px" }}>
          <option>All users</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Last Active</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", flexShrink:0 }}>
                      {u.initials}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color:"#64748b" }}>{u.email}</td>
                <td style={{ color:"#64748b" }}>{u.joined}</td>
                <td style={{ color: u.status === "inactive" ? "#f87171" : "#64748b" }}>{u.lastActive}</td>
                <td>
                  <span className={`badge ${u.status === "active" ? "b-active" : "b-pending"}`}>
                    {u.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}