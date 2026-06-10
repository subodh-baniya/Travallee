import { useState, useMemo } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Authcontext } from "../../Contexts/Authcontext";


const INITIAL_HOTELS = []

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 500, padding: "3px 9px",
      borderRadius: 99, background: cfg.bg, color: cfg.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function Initials({ name }) {
  const letters = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "#E6F1FB", color: "#185FA5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 500, flexShrink: 0,
    }}>
      {letters}
    </div>
  );
}

function StatCard({ label, count, color }) {
  return (
    <div style={{
      background: "#f8fafc", borderRadius: 10, padding: "12px 18px",
      border: "0.5px solid #e2e8f0", minWidth: 80, textAlign: "center",
    }}>
      <div style={{ fontSize: 22, fontWeight: 600, color }}>{count}</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ActionButtons({ hotel, onChangeStatus, compact = false }) {
  const btn = (label, bg, color, border, next) => (
    <button
      key={label}
      onClick={(e) => { e.stopPropagation(); onChangeStatus(hotel.id, next); }}
      style={{
        fontSize: compact ? 13 : 12, fontWeight: 500,
        padding: compact ? "8px 18px" : "5px 11px",
        borderRadius: 7, cursor: "pointer", border,
        background: bg, color, fontFamily: "inherit",
        flex: compact ? 1 : "none",
        transition: "opacity .15s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = ".8"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {label}
    </button>
  );

  if (hotel.status === "pending") return (
    <div style={{ display: "flex", gap: 6 }}>
      {btn("Accept", "#1D9E75", "#fff", "none", "active")}
      {btn("Decline", "#FCEBEB", "#A32D2D", "0.5px solid #F7C1C1", "declined")}
    </div>
  );
  if (hotel.status === "active") return (
    <div style={{ display: "flex", gap: 6 }}>
      {btn("Revoke", "#FCEBEB", "#A32D2D", "0.5px solid #F7C1C1", "declined")}
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {btn("Reconsider", "#FAEEDA", "#854F0B", "0.5px solid #FAC775", "pending")}
    </div>
  );
}

function DrawerDetail({ hotel, onClose, onChangeStatus }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)",
        display: "flex", justifyContent: "flex-end", zIndex: 10,
        borderRadius: 12,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", width: 340, height: "100%",
          display: "flex", flexDirection: "column",
          borderLeft: "0.5px solid #e2e8f0",
          borderRadius: "0 12px 12px 0", overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9",
        }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Hotel details</span>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "0.5px solid #e2e8f0", borderRadius: 7,
              cursor: "pointer", padding: "4px 8px", fontSize: 14, color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Hotel identity */}
        <div style={{ padding: "16px 18px", borderBottom: "0.5px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 13, fontSize: 26,
              background: "#f8fafc", border: "0.5px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {hotel.emoji}
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", margin: 0 }}>{hotel.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                <Badge status={hotel.status} />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{hotel.stars}</span>
              </div>
            </div>
          </div>
          {[
            ["🏠", "Rooms", hotel.rooms],
            ["📍", "Address", hotel.address],
            ["📅", "Submitted", hotel.date],
          ].map(([icon, label, val]) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "6px 0", fontSize: 13,
              borderTop: "0.5px solid #f8fafc",
            }}>
              <span style={{ color: "#64748b" }}>{icon} {label}</span>
              <span style={{ fontWeight: 500, color: "#0f172a", textAlign: "right", maxWidth: 170, fontSize: 12 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Owner info */}
        <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 10 }}>Owner</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Initials name={hotel.owner} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{hotel.owner}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Hotel owner</p>
            </div>
          </div>
          {[
            ["📞", hotel.phone],
            ["✉️", hotel.email],
          ].map(([icon, val]) => (
            <div key={val} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
              <span style={{ color: "#64748b" }}>{icon}</span>
              <span style={{ color: "#185FA5", fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div style={{ padding: "14px 18px", flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 8 }}>Admin notes</p>
          <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.65, margin: 0 }}>{hotel.notes}</p>
        </div>

        {/* Action footer */}
        <div style={{
          padding: "14px 18px", borderTop: "0.5px solid #f1f5f9",
          display: "flex", gap: 8,
        }}>
          <ActionButtons hotel={hotel} onChangeStatus={onChangeStatus} compact />
        </div>
      </div>
    </div>
  );
}

export default function HotelRegistrations() {
  const [hotels, setHotels] = useState(INITIAL_HOTELS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const { socket, socketConnected } = useContext(Authcontext);



  useEffect(() => {
    if (!socket) return;

    const handleHotelRegistration = (hotelData) => {
      console.log("Received hotel registration:", hotelData);

      setHotels((prev) => [
        {
          id: hotelData._id || Date.now(),
          emoji: "🏨",
          name: hotelData.hotelName,
          stars: `${hotelData.starRating || 0} star`,
          rooms: `${hotelData.rooms || 0} rooms`,
          owner: hotelData.ownerName,
          phone: hotelData.phone,
          email: hotelData.email,
          location: hotelData.location,
          address: hotelData.address,
          date: new Date().toLocaleDateString(),
          status: "pending",
          notes: hotelData.notes || "",
        },
        ...prev,
      ]);
    };

    socket.on("hotelRegistrationsData", handleHotelRegistration);

    return () => {
      socket.off("hotelRegistrationsData", handleHotelRegistration);
    };
  }, [socket]);

  const changeStatus = (id, newStatus) => {
    setHotels(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
  };

  const counts = useMemo(() => ({
    pending: hotels.filter(h => h.status === "pending").length,
    active: hotels.filter(h => h.status === "active").length,
    declined: hotels.filter(h => h.status === "declined").length,
  }), [hotels]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hotels.filter(h => {
      const matches = (h.name + h.owner + h.location + h.stars).toLowerCase().includes(q);
      return matches && (filter === "all" || h.status === filter);
    });
  }, [hotels, search, filter]);

  const selectedHotel = hotels.find(h => h.id === selectedId);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#f8fafc", minHeight: "100vh", padding: "28px 24px",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>Hotel registrations</h1>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, marginBottom: 0 }}>
              Review and manage incoming hotel submissions
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <StatCard label="Pending" count={counts.pending} color="#854F0B" />
            <StatCard label="Active" count={counts.active} color="#3B6D11" />
            <StatCard label="Declined" count={counts.declined} color="#A32D2D" />
          </div>
        </div>

        {/* Search + filter bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{
              position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
              fontSize: 14, color: "#94a3b8", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hotels, owners, locations…"
              style={{
                width: "100%", padding: "8px 12px 8px 32px", fontSize: 13,
                borderRadius: 8, border: "0.5px solid #e2e8f0", background: "#fff",
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                color: "#0f172a",
              }}
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              fontSize: 13, padding: "8px 12px", borderRadius: 8,
              border: "0.5px solid #e2e8f0", background: "#fff",
              color: "#0f172a", fontFamily: "inherit", cursor: "pointer",
            }}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="declined">Declined</option>
          </select>
          <button
            style={{
              fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 8,
              border: "none", background: "#0f172a", color: "#fff",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            + Register hotel
          </button>
        </div>

        {/* Table card */}
        <div style={{
          position: "relative",
          border: "0.5px solid #e2e8f0", borderRadius: 12,
          background: "#fff", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
                {["Hotel", "Owner", "Location", "Submitted", "Status", "Action"].map(col => (
                  <th key={col} style={{
                    textAlign: "left", padding: "10px 16px",
                    fontSize: 11, fontWeight: 600, color: "#94a3b8",
                    letterSpacing: ".05em", textTransform: "uppercase",
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 36, color: "#94a3b8", fontSize: 13 }}>
                    No hotels match your search
                  </td>
                </tr>
              ) : filtered.map(h => (
                <tr
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  style={{
                    borderBottom: "0.5px solid #f1f5f9", cursor: "pointer",
                    transition: "background .1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, fontSize: 19,
                        background: "#f8fafc", border: "0.5px solid #e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        {h.emoji}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{h.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{h.stars} · {h.rooms}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>{h.owner}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>
                    <span style={{ fontSize: 12 }}>📍</span> {h.location}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#94a3b8" }}>{h.date}</td>
                  <td style={{ padding: "12px 16px" }}><Badge status={h.status} /></td>
                  <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                    <ActionButtons hotel={h} onChangeStatus={changeStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Detail Drawer */}
          {selectedHotel && (
            <DrawerDetail
              hotel={selectedHotel}
              onClose={() => setSelectedId(null)}
              onChangeStatus={(id, status) => {
                changeStatus(id, status);
              }}
            />
          )}
        </div>

        <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", marginTop: 16 }}>
          {hotels.length} hotels total · Click any row to view full details
        </p>
      </div>
    </div>
  );
}