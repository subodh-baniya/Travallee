const bookings = [
  { num: "#BK-4821", hotel: "Grand Vista Hotel", guest: "Arjun Maharjan", nights: "2 nights", dates: "May 28 – May 30", amount: "NPR 12,000", status: "active"   },
  { num: "#BK-4820", hotel: "Sunrise Inn",        guest: "Sita Gurung",   nights: "3 nights", dates: "May 29 – Jun 1",  amount: "NPR 8,500",  status: "active"   },
  { num: "#BK-4819", hotel: "Lake View Resort",   guest: "Ram Shrestha",  nights: "5 nights", dates: "Jun 1 – Jun 6",   amount: "NPR 42,000", status: "pending"  },
  { num: "#BK-4818", hotel: "Mountain Breeze",    guest: "Nita Tamang",   nights: "1 night",  dates: "May 27 – May 28", amount: "NPR 3,200",  status: "declined" },
];

const badgeMap = {
  active:   { cls: "b-active",   label: "Confirmed" },
  pending:  { cls: "b-pending",  label: "Pending"   },
  declined: { cls: "b-declined", label: "Cancelled" },
};

export default function Bookings() {
  return (
    <>
      <div className="section-title">Recent Bookings</div>
      <div className="section-sub">All recent hotel bookings — cancel any booking if needed</div>

      <div className="search-bar">
        <input className="search-input" placeholder="Search by guest or hotel..." />
        <button className="btn">Filter</button>
      </div>

      {bookings.map((b) => {
        const badge = badgeMap[b.status];
        const cancelled = b.status === "declined";
        return (
          <div className="booking-card" key={b.num}>
            <div className="bk-num">{b.num}</div>
            <div>
              <div className="bk-hotel">{b.hotel}</div>
              <div className="bk-guest">Guest: {b.guest} · {b.nights}</div>
            </div>
            <div className="bk-meta">
              <div className="bk-date">{b.dates}</div>
              <div className="bk-amount">{b.amount}</div>
            </div>
            <span className={`badge ${badge.cls}`} style={{ margin: "0 8px" }}>{badge.label}</span>
            <button
              className="mini-btn decline"
              disabled={cancelled}
              style={{ opacity: cancelled ? 0.4 : 1 }}
            >
              Cancel
            </button>
          </div>
        );
      })}
    </>
  );
}