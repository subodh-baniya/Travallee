export default function Loader() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f0f6ff",
      fontFamily: "DM Sans, sans-serif",
      color: "#0369a1",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "4px solid rgba(2,132,199,0.16)",
          borderTopColor: "#0284c7",
          animation: "spin 0.9s linear infinite",
          boxSizing: "border-box",
        }} />
        <span>Loading superadmin workspace...</span>
      </div>
      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
