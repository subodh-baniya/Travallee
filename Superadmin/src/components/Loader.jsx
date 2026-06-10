import logoImage from "../assets/images/Logo.jpg";

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
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 24px rgba(2,132,199,0.16)",
          animation: "floaty 2.8s ease-in-out infinite",
        }}>
          <img
            src={logoImage}
            alt="Superadmin logo"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <span>Loading superadmin workspace...</span>
      </div>
      <style>{"@keyframes floaty { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-3px) scale(1.03); } }"}</style>
    </div>
  );
}
