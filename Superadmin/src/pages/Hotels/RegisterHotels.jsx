const hotels = [
  { emoji: "🏨", name: "Grand Vista Hotel", stars: "4 star", rooms: "120 rooms", owner: "Rohan Sharma", location: "Kathmandu", date: "May 25, 2026", status: "pending"  },
  { emoji: "🏩", name: "Sunrise Inn",        stars: "3 star", rooms: "45 rooms",  owner: "Priya Thapa",  location: "Pokhara",   date: "May 24, 2026", status: "pending"  },
  { emoji: "🏦", name: "Lake View Resort",   stars: "5 star", rooms: "200 rooms", owner: "Anil KC",      location: "Chitwan",   date: "May 22, 2026", status: "active"   },
  { emoji: "🏠", name: "Mountain Breeze",    stars: "3 star", rooms: "30 rooms",  owner: "Sita Rai",     location: "Nagarkot",  date: "May 20, 2026", status: "declined" },
];

const badgeMap = {
  pending:  { cls: "bg-yellow-100 text-yellow-800",  label: "Pending"  },
  active:   { cls: "bg-emerald-100 text-emerald-800",   label: "Accepted" },
  declined: { cls: "bg-red-100 text-red-800", label: "Declined" },
};

export default function RegisterHotels() {
  return (
    <>
      <div className="text-base font-semibold text-slate-900 mb-1">Hotel Registration Requests</div>
      <div className="text-[13px] text-slate-500 mb-4.5">Review and approve or decline incoming hotel registrations</div>

      <div className="flex items-center gap-2.5 mb-4">
        <input 
          className="flex-1 py-[9px] px-3.5 rounded-lg border border-brand-border text-[13px] text-slate-900 bg-white outline-none transition-colors duration-150 focus:border-brand-accent2" 
          placeholder="Search hotels..." 
        />
        <button className="py-2 px-4 rounded-lg text-[13px] font-medium cursor-pointer border border-brand-border2 bg-white text-slate-900 transition-all duration-150 hover:bg-[#f0f9ff] hover:border-brand-accent2">
          Filter
        </button>
        <button className="py-2 px-4 rounded-lg text-[13px] font-semibold cursor-pointer border border-brand-accent bg-brand-accent text-white transition-all duration-150 hover:bg-[#0369a1]">
          + Register Hotel
        </button>
      </div>

      <div className="border border-brand-border overflow-hidden bg-white rounded-lg">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#f8faff] border-b border-brand-border">
              <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Hotel</th>
              <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Owner</th>
              <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Location</th>
              <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Submitted</th>
              <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Status</th>
              <th className="text-[11px] uppercase tracking-[0.06em] text-slate-500 p-[12px_16px] font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h) => {
              const b = badgeMap[h.status];
              return (
                <tr key={h.name} className="border-b border-brand-border/60 last:border-b-0 hover:bg-[#f8faff]">
                  <td className="p-[13px_16px] text-slate-900 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[34px] h-[34px] rounded-[9px] bg-brand-accentBg flex items-center justify-center text-base shrink-0">{h.emoji}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{h.name}</div>
                        <div className="text-[11px] text-slate-500">{h.stars} · {h.rooms}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-[13px_16px] text-slate-900 align-middle">{h.owner}</td>
                  <td className="p-[13px_16px] text-slate-900 align-middle">{h.location}</td>
                  <td className="p-[13px_16px] text-slate-500 align-middle font-medium">{h.date}</td>
                  <td className="p-[13px_16px] align-middle"><span className={`text-[11px] py-0.75 px-2.5 rounded-full font-medium ${b.cls}`}>{b.label}</span></td>
                  <td className="p-[13px_16px] align-middle">
                    <div className="flex gap-1.5">
                      {h.status === "pending" && (
                        <>
                          <button className="text-[11px] py-1.25 px-3 rounded-md cursor-pointer font-sans font-medium transition-all duration-150 bg-brand-accent text-white hover:bg-[#0369a1]">
                            Accept
                          </button>
                          <button className="text-[11px] py-1.25 px-3 rounded-md cursor-pointer font-sans font-medium transition-all duration-150 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                            Decline
                          </button>
                        </>
                      )}
                      {h.status === "active" && (
                        <button className="text-[11px] py-1.25 px-3 rounded-md cursor-pointer font-sans font-medium transition-all duration-150 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                          Revoke
                        </button>
                      )}
                      {h.status === "declined" && (
                        <button className="text-[11px] py-1.25 px-3 rounded-md cursor-pointer font-sans font-medium transition-all duration-150 bg-brand-accent text-white hover:bg-[#0369a1]">
                          Reconsider
                        </button>
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