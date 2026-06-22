import { useEffect, useState } from 'react';

export default function CountUp({ end=0, duration=900 }){
  const [val, setVal] = useState(0);
  useEffect(()=>{
    let start = 0; const steps = Math.max(6, Math.floor(duration/30));
    const inc = (end - start)/steps; let i=0;
    const t = setInterval(()=>{
      i++; start += inc; setVal(Math.floor(start));
      if(i>=steps){ setVal(end); clearInterval(t); }
    }, Math.max(10, Math.floor(duration/steps)));
    return ()=> clearInterval(t);
  },[end,duration]);
  return <span>{val}</span>;
}
