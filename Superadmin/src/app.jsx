import Sidebar from "./components/Sidebar";
import { globalCSS } from "./theme";
import { useState } from "react";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <style>{globalCSS}</style>
      <div className="dash-wrap">
        <Sidebar page={page} setPage={setPage} />
        <div className="main">
          <div style={{ padding: 30, color: "#7a7a8c", fontFamily: "monospace" }}>
            ← Select a page from the sidebar
          </div>
        </div>
      </div>
    </>
  );
}