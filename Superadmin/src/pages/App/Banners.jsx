export default function Banners() {
  const banners = [
    { emoji: "🏖️", name: "Summer Sale Banner",  date: "May 25", status: "active" },
    { emoji: "🏨", name: "Hotel Partner Promo", date: "May 20", status: "active" },
    { emoji: "🎉", name: "New Feature Launch",  date: "May 18", status: "paused" },
  ];

  return (
    <>
      <style>{`
        .upload-zone{border:2px dashed #bae6fd;border-radius:12px;padding:36px 20px;text-align:center;background:#f0f9ff;cursor:pointer;transition:all 0.2s;margin-bottom:16px}
        .upload-zone:hover{border-color:#0284c7;background:#e0f2fe}
        .upload-title{font-size:14px;font-weight:500;color:#0f172a;margin-bottom:4px}
        .upload-sub{font-size:12px;color:#64748b}
        .upload-sub span{color:#0284c7;font-weight:500}
        .res-tag{display:inline-flex;align-items:center;gap:6px;background:#e0f2fe;color:#0369a1;font-size:11px;font-weight:500;padding:4px 12px;border-radius:20px;margin-bottom:16px}
        .banner-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .banner-card{background:#fff;border:0.5px solid rgba(99,120,210,0.12);border-radius:10px;overflow:hidden}
        .banner-img{height:90px;background:linear-gradient(135deg,#e0f2fe,#bae6fd);display:flex;align-items:center;justify-content:center;font-size:32px}
        .banner-body{padding:10px 14px}
        .banner-name{font-size:13px;font-weight:500;color:#0f172a}
        .banner-meta{font-size:11px;color:#64748b;margin-top:2px}
        .banner-actions{display:flex;align-items:center;gap:6px;margin-top:10px}
        .banner-add{border:2px dashed #bae6fd!important;background:#f8faff!important;display:flex;align-items:center;justify-content:center;min-height:140px;cursor:pointer;transition:all 0.2s}
        .banner-add:hover{border-color:#0284c7!important;background:#e0f2fe!important}
      `}</style>

      <div className="section-title">App Banners</div>
      <div className="section-sub">Upload banners shown inside the app. Fixed resolution: <strong>1200 × 400 px</strong></div>

      <div className="upload-zone">
        <div style={{ fontSize:36, marginBottom:10 }}>📤</div>
        <div className="upload-title">Click to upload banner</div>
        <div className="upload-sub">PNG or JPG · <span>Fixed: 1200 × 400 px</span> · Max 2 MB</div>
      </div>

      <div className="res-tag">📐 Required resolution: 1200 × 400 px</div>

      <div style={{ fontSize:13, fontWeight:600, color:"#0f172a", marginBottom:12 }}>
        Active Banners <span style={{ fontSize:12, color:"#64748b", fontWeight:400 }}>({banners.filter(b=>b.status==="active").length} live)</span>
      </div>

      <div className="banner-grid">
        {banners.map((b) => (
          <div className="banner-card" key={b.name}>
            <div className="banner-img">{b.emoji}</div>
            <div className="banner-body">
              <div className="banner-name">{b.name}</div>
              <div className="banner-meta">1200×400 · Uploaded {b.date}</div>
              <div className="banner-actions">
                <span className={`badge ${b.status === "active" ? "b-active" : "b-pending"}`}>
                  {b.status === "active" ? "Live" : "Paused"}
                </span>
                <button className="mini-btn mb-neutral" style={{ marginLeft:"auto" }}>Edit</button>
                <button className="mini-btn mb-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
        <div className="banner-card banner-add">
          <div style={{ textAlign:"center", color:"#7dd3fc" }}>
            <div style={{ fontSize:28, marginBottom:6 }}>＋</div>
            <div style={{ fontSize:12, fontWeight:500 }}>Add Banner</div>
          </div>
        </div>
      </div>
    </>
  );
}