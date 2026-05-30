const users = [
  { initials:"AK", color:"#38bdf8", name:"Arjun K.",  email:"arjun@mail.com", lastActive:"2 min ago",   reason:"—",           blocked:false },
  { initials:"RB", color:"#f87171", name:"Raj B.",    email:"raj@mail.com",   lastActive:"5 days ago",  reason:"Spam",        blocked:true  },
  { initials:"ST", color:"#818cf8", name:"Sita T.",   email:"sita@mail.com",  lastActive:"1 hr ago",    reason:"—",           blocked:false },
  { initials:"NK", color:"#fbbf24", name:"Nita K.",   email:"nita@mail.com",  lastActive:"12 days ago", reason:"Fake listing", blocked:true },
];

export default function BlockUsers() {
  return (
    <>
      <div className="section-title">Block / Unblock Users</div>
      <div className="section-sub">Manage blocked users — block or unblock anyone from accessing the app</div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-val">12,481</div><div className="stat-sub">On platform</div></div>
        <div className="stat-card" style={{ borderTopColor:"#f87171" }}><div className="stat-label">Blocked</div><div className="stat-val" style={{ color:"#991b1b" }}>24</div><div className="stat-sub">Currently blocked</div></div>
        <div className="stat-card" style={{ borderTopColor:"#4ade80" }}><div className="stat-label">Active</div><div className="stat-val" style={{ color:"#166534" }}>12,457</div><div className="stat-sub">Normal access</div></div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <input className="search-input" placeholder="Search by name or email..." />
        <select className="form-input" style={{ width:"auto", padding:"9px 14px" }}>
          <option>All users</option>
          <option>Blocked</option>
          <option>Active</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Last Active</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
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
                <td style={{ color:"#64748b" }}>{u.lastActive}</td>
                <td style={{ color:"#64748b" }}>{u.reason}</td>
                <td>
                  <span className={`badge ${u.blocked ? "b-declined" : "b-active"}`}>
                    {u.blocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  <button
                    className={`mini-btn ${u.blocked ? "mb-success" : "mb-danger"}`}
                    style={{ fontSize:11, padding:"5px 12px", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontWeight:500 }}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual block */}
      <div className="full-panel" style={{ marginTop:16 }}>
        <div className="panel-hd"><span className="panel-title">Block a User Manually</span></div>
        <div className="form-row">
          <label className="form-label">User Email or ID</label>
          <input className="form-input" placeholder="e.g. user@mail.com" />
        </div>
        <div className="form-row">
          <label className="form-label">Reason</label>
          <input className="form-input" placeholder="e.g. Spam, fake account, abusive behaviour..." />
        </div>
        <button className="btn" style={{ background:"#dc2626", color:"#fff", border:"none", fontWeight:600 }}>
          Block User
        </button>
      </div>

      <style>{`
        .mini-btn.mb-neutral{border:0.5px solid rgba(99,120,210,0.22);background:#f8faff;color:#64748b}
        .mini-btn.mb-neutral:hover{border-color:#38bdf8;color:#0284c7}
        .mini-btn.mb-danger{border:0.5px solid #fca5a5;background:#fff5f5;color:#dc2626}
        .mini-btn.mb-danger:hover{background:#fee2e2}
        .mini-btn.mb-success{border:0.5px solid #86efac;background:#f0fdf4;color:#166534}
        .mini-btn.mb-success:hover{background:#dcfce7}
      `}</style>
    </>
  );
}