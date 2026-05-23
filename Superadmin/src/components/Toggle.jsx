import { useState } from "react";
import { theme } from "../theme";

export default function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        border: on ? "none" : `1px solid ${theme.border2}`,
        background: on ? theme.accent : "#e0e4f0",
        cursor: "pointer", position: "relative",
        flexShrink: 0, transition: "background 0.2s",
        boxShadow: on ? `0 2px 8px rgba(42,82,212,0.3)` : "none",
      }}
    >
      <span style={{
        position: "absolute", width: 16, height: 16,
        borderRadius: "50%", background: "#fff",
        top: 3, left: on ? 21 : 3,
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}