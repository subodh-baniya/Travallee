
import { useState } from "react";
import { theme } from "../theme";

export default function Toggle({ defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      style={{
        width: 38, height: 22, borderRadius: 11,
        border: on ? "none" : `1px solid ${theme.border2}`,
        background: on ? theme.accent : theme.surface,
        cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute", width: 16, height: 16, borderRadius: "50%",
        background: "#fff", top: 3, left: on ? 19 : 3, transition: "left 0.2s",
      }} />
    </button>
  );
}