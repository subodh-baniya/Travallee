import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRecentActivity } from "../../Services/admin.api";

export default function RecentActivity({ items=[] }) {
  const [list, setList] = useState(items || []);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await getRecentActivity();
        if (mounted) setList(res || []);
      } catch (e) { console.error(e); }
    };
    if ((!items || items.length===0)) fetch();
    const t = setInterval(fetch, 15_000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <div>
      <div className="text-base font-bold text-slate-900 mb-1.5">Recent Activity</div>
      <div className="text-xs text-slate-500 mb-3.5">Latest platform events</div>
      <div className="flex flex-col gap-2">
        {list.length===0 && (
          <div className="text-sm text-slate-500">No recent activity</div>
        )}
        {list.map((a,i) => (
          <motion.div key={i} initial={{x:40, opacity:0}} animate={{x:0, opacity:1}} transition={{delay:i*0.03}} className="p-2 rounded-md hover:bg-slate-50 flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: a.color||'#38bdf8' }} />
            <div>
              <div className="text-sm text-slate-900">{a.text}</div>
              <div className="text-xs text-slate-400">{a.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
