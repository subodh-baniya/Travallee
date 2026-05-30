const codes = [
  { code:"TRAVALEE20", desc:"20% off any booking",       expiry:"Jun 30", used:45, max:100, status:"active"  },
  { code:"WELCOME50",  desc:"NPR 500 off first booking", expiry:"Jul 15", used:12, max:50,  status:"active"  },
  { code:"STAY3FREE",  desc:"Free 1 night on 3-night",   expiry:"May 1",  used:17, max:20,  status:"expired" },
];

export default function RedeemCode() {
  return (
    <>
      <div className="section-title">Redeem Codes</div>
      <div className="section-sub">Generate and manage redeem codes for app users</div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total Codes</div><div className="stat-val">48</div><div className="stat-sub">Generated so far</div></div>
        <div className="stat-card" style={{ borderTopColor:"#4ade80" }}><div className="stat-label">Active</div><div className="stat-val" style={{ color:"#166534" }}>31</div><div className="stat-sub">Available to redeem</div></div>
        <div className="stat-card" style={{ borderTopColor:"#94a3b8" }}><div className="stat-label">Used</div><div className="stat-val" style={{ color:"#64748b" }}>17</div><div className="stat-sub">Already redeemed</div></div>
      </div>

      {/* Generate form */}
      <div className="full-panel">
        <div className="panel-hd"><span className="panel-title">Generate New Code</span></div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:140 }}>
            <label className="form-label">Discount Type</label>
            <select className="form-input"><option>Percentage (%)</option><option>Fixed Amount (NPR)</option><option>Free Night</option></select>
          </div>
          <div style={{ flex:1, minWidth:120 }}>
            <label className="form-label">Value</label>
            <input className="form-input" placeholder="e.g. 20" type="number" />
          </div>
          <div style={{ flex:1, minWidth:120 }}>
            <label className="form-label">Expiry Date</label>
            <input className="form-input" type="date" />
          </div>
          <div style={{ flex:1, minWidth:120 }}>
            <label className="form-label">Max Uses</label>
            <input className="form-input" placeholder="e.g. 100" type="number" />
          </div>
        </div>
        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <button className="btn primary">Generate Code</button>
          <button className="btn">Generate Bulk (10)</button>
        </div>
      </div>

      {/* Code list */}
      <div style={{ fontSize:13, fontWeight:600, color:"#0f172a", marginBottom:12 }}>Recent Codes</div>
      {codes.map((c) => (
        <div className="hotel-row" key={c.code}>
          <div style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:"#0284c7", background:"#e0f2fe", padding:"4px 12px", borderRadius:6, minWidth:110, textAlign:"center" }}>
            {c.code}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:"#0f172a" }}>{c.desc}</div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>Expires {c.expiry} · {c.used}/{c.max} used</div>
          </div>
          <span className={`badge ${c.status === "active" ? "b-active" : "b-declined"}`} style={{ marginLeft:"auto" }}>
            {c.status === "active" ? "Active" : "Expired"}
          </span>
          <button className={`mini-btn ${c.status === "active" ? "mb-danger" : "mb-neutral"}`} style={{ marginLeft:10 }}>
            {c.status === "active" ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      ))}

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