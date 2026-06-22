const hotels = [
  { emoji: "🏨", name: "Grand Vista Hotel", loc: "Kathmandu · 4 star", active: true  },
  { emoji: "🏩", name: "Sunrise Inn",        loc: "Pokhara · 3 star",   active: true  },
  { emoji: "🏠", name: "Mountain Breeze",    loc: "Nagarkot · 3 star",  active: false },
  { emoji: "🏨", name: "Lake View Resort",   loc: "Chitwan · 5 star",   active: true  },
  { emoji: "🏨", name: "Heritage Palace",    loc: "Bhaktapur · 4 star", active: false },
  { emoji: "🏨", name: "Green Valley Inn",   loc: "Bandipur · 3 star",  active: true  },
];

const active   = hotels.filter((h) => h.active).length;
const inactive = hotels.filter((h) => !h.active).length;

export default function HotelStatus() {
  return (
    <>
      <div className="text-base font-semibold text-slate-900 mb-1">Hotel Status</div>
      <div className="text-[13px] text-slate-500 mb-4.5">Active and inactive hotels across the platform</div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4.5">
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px] border-t-[3px] border-t-sky-300">
          <div className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-[0.07em]">Total Hotels</div>
          <div className="text-[28px] font-semibold text-slate-900 font-mono">{hotels.length}</div>
          <div className="text-xs text-slate-500 mt-1.25">Registered on platform</div>
        </div>
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px] border-t-[3px] border-t-emerald-400">
          <div className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-[0.07em]">Active</div>
          <div className="text-[28px] font-semibold font-mono text-emerald-800">{active}</div>
          <div className="text-xs text-slate-500 mt-1.25">Currently accepting bookings</div>
        </div>
        <div className="bg-white border border-brand-border rounded-xl p-[18px_20px] border-t-[3px] border-t-red-400">
          <div className="text-[11px] text-slate-500 mb-2 font-medium uppercase tracking-[0.07em]">Inactive</div>
          <div className="text-[28px] font-semibold font-mono text-red-800">{inactive}</div>
          <div className="text-xs text-slate-500 mt-1.25">Paused or under review</div>
        </div>
      </div>

      {/* Filter + Search */}
      <div className="flex items-center gap-2.5 mb-4">
        <input 
          className="flex-1 py-[9px] px-3.5 rounded-lg border border-brand-border text-[13px] text-slate-900 bg-white outline-none transition-colors duration-150 focus:border-brand-accent2" 
          placeholder="Search hotels..." 
        />
        <select className="w-auto py-[9px] px-3.5 rounded-lg border border-brand-border text-[13px] text-slate-900 bg-white outline-none cursor-pointer">
          <option>All hotels</option>
          <option>Active only</option>
          <option>Inactive only</option>
        </select>
      </div>

      {/* Hotel list */}
      {hotels.map((h) => (
        <div className="bg-white border border-brand-border rounded-[10px] p-[13px_18px] mb-2.25 flex items-center gap-3 transition-colors duration-150 hover:border-sky-300" key={h.name}>
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${h.active ? "bg-emerald-400" : "bg-red-400"}`}
          />
          <div className="w-[34px] h-[34px] rounded-[9px] bg-brand-accentBg flex items-center justify-center text-base shrink-0">{h.emoji === "lol" ? "🏨" : h.emoji}</div>
          <div>
            <div className="text-[13px] font-medium text-slate-900">{h.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{h.loc}</div>
          </div>
          <span
            className={`text-[11px] py-0.75 px-2.5 rounded-full font-medium ml-auto ${h.active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
          >
            {h.active ? "Active" : "Inactive"}
          </span>
          <button className="text-[11px] py-1.25 px-3 rounded-md cursor-pointer font-sans font-medium transition-all duration-150 border border-brand-border2 bg-[#f8faff] text-slate-500 hover:border-brand-accent2 hover:text-brand-accent ml-2.5">
            {h.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </>
  );
}