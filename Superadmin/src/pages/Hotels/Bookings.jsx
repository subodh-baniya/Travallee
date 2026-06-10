const bookings = [
  { num: "#BK-4821", hotel: "Grand Vista Hotel", guest: "Arjun Maharjan", nights: "2 nights", dates: "May 28 – May 30", amount: "NPR 12,000", status: "active"   },
  { num: "#BK-4820", hotel: "Sunrise Inn",        guest: "Sita Gurung",   nights: "3 nights", dates: "May 29 – Jun 1",  amount: "NPR 8,500",  status: "active"   },
  { num: "#BK-4819", hotel: "Lake View Resort",   guest: "Ram Shrestha",  nights: "5 nights", dates: "Jun 1 – Jun 6",   amount: "NPR 42,000", status: "pending"  },
  { num: "#BK-4818", hotel: "Mountain Breeze",    guest: "Nita Tamang",   nights: "1 night",  dates: "May 27 – May 28", amount: "NPR 3,200",  status: "declined" },
];

const badgeMap = {
  active:   { cls: "bg-emerald-100 text-emerald-800",   label: "Confirmed" },
  pending:  { cls: "bg-yellow-100 text-yellow-800",  label: "Pending"   },
  declined: { cls: "bg-red-100 text-red-800", label: "Cancelled" },
};

export default function Bookings() {
  return (
    <>
      <div className="text-base font-semibold text-slate-900 mb-1">Recent Bookings</div>
      <div className="text-[13px] text-slate-500 mb-4.5">All recent hotel bookings — cancel any booking if needed</div>

      <div className="flex items-center gap-2.5 mb-4">
        <input 
          className="flex-1 py-[9px] px-3.5 rounded-lg border border-brand-border text-[13px] text-slate-900 bg-white outline-none transition-colors duration-150 focus:border-brand-accent2" 
          placeholder="Search by guest or hotel..." 
        />
        <button className="py-2 px-4 rounded-lg text-[13px] font-medium cursor-pointer border border-brand-border2 bg-white text-slate-900 transition-all duration-150 hover:bg-[#f0f9ff] hover:border-brand-accent2">
          Filter
        </button>
      </div>

      {bookings.map((b) => {
        const badge = badgeMap[b.status];
        const cancelled = b.status === "declined";
        return (
          <div className="bg-white border border-brand-border rounded-[10px] p-[14px_18px] mb-2.5 flex items-center gap-3.5 transition-colors duration-150 hover:border-sky-300" key={b.num}>
            <div className="text-xs text-brand-accent font-medium w-20 shrink-0 font-mono">{b.num}</div>
            <div>
              <div className="text-[13px] font-medium text-slate-900">{b.hotel}</div>
              <div className="text-xs text-slate-500 mt-0.5">Guest: {b.guest} · {b.nights}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-slate-500">{b.dates}</div>
              <div className="text-[13px] font-semibold text-[#0369a1] mt-0.5">{b.amount}</div>
            </div>
            <span className={`text-[11px] py-0.75 px-2.5 rounded-full font-medium mx-2 ${badge.cls}`}>{badge.label}</span>
            <button
              className="text-[11px] py-1.25 px-3 rounded-md cursor-pointer font-sans font-medium transition-all duration-150 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={cancelled}
            >
              Cancel
            </button>
          </div>
        );
      })}
    </>
  );
}