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
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "2px solid #7dd3fc",
          borderTopColor: "#0284c7",
          animation: "spin 0.8s linear infinite",
        }} />
        <span>Loading superadmin workspace...</span>
      </div>
      <style>{"@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}
