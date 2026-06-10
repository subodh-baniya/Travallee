import { useState } from "react";

export default function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-10 h-[22px] rounded-[11px] cursor-pointer relative shrink-0 transition-all duration-200 focus:outline-none ${
        on 
          ? "bg-brand-accent shadow-[0_2px_8px_rgba(2,132,199,0.3)] border-none" 
          : "bg-[#e0e4f0] border border-brand-border2"
      }`}
    >
      <span 
        className={`absolute w-4 h-4 rounded-full bg-white top-[2px] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${
          on ? "left-[21px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}