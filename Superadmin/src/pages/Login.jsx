import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import logoImage from "../assets/images/Logo.jpg";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [form, setForm] = useState({ Username: "", password: "", superAdminKey: "" });
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState("");

  const onChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!auth) {
      setError("Authentication is not initialized.");
      return;
    }

    if (!form.Username.trim() || !form.password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setAnimating(true);

    try {
      await auth.login({
        Username: form.Username.trim(),
        password: form.password,
        superAdminKey: form.superAdminKey.trim() || undefined,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/dashboard/app/banners", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
      setAnimating(false);
    }
  };

  return (
    <>
      <style>{`
        .login-bg {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 30%),
            linear-gradient(160deg, #f8fbff 0%, #eef7ff 48%, #e7f1fb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .login-bg::before,
        .login-bg::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          filter: blur(10px);
          opacity: 0.5;
          pointer-events: none;
        }
        .login-bg::before {
          width: 260px;
          height: 260px;
          left: -90px;
          bottom: -110px;
          background: rgba(186,230,253,0.55);
        }
        .login-bg::after {
          width: 220px;
          height: 220px;
          right: -80px;
          top: -90px;
          background: rgba(191,219,254,0.45);
        }
        .login-shell {
          width: min(100%, 460px);
          position: relative;
          z-index: 1;
        }
        .login-card {
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 28px;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
          padding: 34px 30px 26px;
          width: 100%;
          backdrop-filter: blur(18px);
          position: relative;
          overflow: hidden;
        }
        .login-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 40%);
          pointer-events: none;
        }
        .login-logo {
          width: 92px;
          height: 92px;
          border-radius: 28px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px auto 18px;
          background: linear-gradient(180deg, #ffffff 0%, #f4faff 100%);
          box-shadow: 0 18px 38px rgba(2, 132, 199, 0.16);
          animation: floaty 3.6s ease-in-out infinite;
          border: 1px solid rgba(186,230,253,0.85);
        }
        .login-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .login-logo.animating {
          animation: launch 2s ease-in-out 1;
        }
        .login-title {
          font-size: 30px;
          font-weight: 700;
          color: #0f172a;
          text-align: center;
          margin: 0 0 10px;
          letter-spacing: -0.03em;
        }
        .login-sub {
          font-size: 14px;
          color: #64748b;
          text-align: center;
          margin: 0 0 26px;
        }
        .form-group {
          margin-bottom: 12px;
        }
        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          margin-bottom: 8px;
        }
        .form-input {
          width: 100%;
          padding: 13px 14px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,0.22);
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          background: rgba(255,255,255,0.92);
          outline: none;
          transition: border 0.18s, box-shadow 0.18s, transform 0.18s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.12);
          transform: translateY(-1px);
        }
        .signin-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
          margin-top: 14px;
          box-shadow: 0 14px 30px rgba(2,132,199,0.22);
        }
        .signin-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 36px rgba(2,132,199,0.26);
        }
        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .error-box {
          margin-top: 10px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          border-radius: 14px;
          padding: 10px 12px;
          font-size: 13px;
          color: #991b1b;
        }
        .hint {
          margin-top: 18px;
          font-size: 12px;
          color: #64748b;
          text-align: center;
          letter-spacing: 0.04em;
        }
        .login-meta {
          margin-top: 16px;
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .login-chip {
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(148,163,184,0.18);
          font-size: 11px;
          color: #475569;
        }
        .login-overlay {
          position: relative;
          inset: 0;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(248,251,255,0.72);
          backdrop-filter: blur(8px);
          z-index: 3;
          margin-top: 16px;
          border-radius: 24px;
          min-height: 170px;
        }
        .login-overlay.show {
          display: flex;
        }
        .login-overlay-inner {
          text-align: center;
        }
        .login-overlay-logo {
          width: 88px;
          height: 88px;
          border-radius: 28px;
          overflow: hidden;
          margin: 0 auto 14px;
          box-shadow: 0 18px 40px rgba(2,132,199,0.18);
          animation: launch 2s ease-in-out 1;
          border: 1px solid rgba(186,230,253,0.9);
        }
        .login-overlay-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .login-overlay-text {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        .login-overlay-sub {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.03); }
        }
        @keyframes launch {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          20% { transform: translateY(-10px) scale(1.05) rotate(-1deg); }
          45% { transform: translateY(-20px) scale(1.08) rotate(1deg); }
          70% { transform: translateY(-8px) scale(1.03) rotate(0deg); }
          100% { transform: translateY(0) scale(1) rotate(0deg); }
        }
        @media (max-width: 860px) {
          .login-shell {
            width: min(100%, 420px);
          }
        }
      `}</style>

      <div className="login-bg">
        <div className="login-shell">
          <div className="login-card">
            <div className={`login-logo${animating ? " animating" : ""}`}>
              <img src={logoImage} alt="Superadmin logo" />
            </div>
            <h1 className="login-title">Superadmin Login</h1>
            <p className="login-sub">Sign in to continue to the control center</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter your superadmin username"
                  value={form.Username}
                  onChange={onChange("Username")}
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="current-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Super Admin Key (optional)</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter superadmin key (if assigned)"
                  value={form.superAdminKey}
                  onChange={onChange("superAdminKey")}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}

              <button className="signin-btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div className={`login-overlay${animating ? " show" : ""}`} aria-hidden={!animating}>
              <div className="login-overlay-inner">
                <div className="login-overlay-logo">
                  <img src={logoImage} alt="Superadmin logo animation" />
                </div>
                <div className="login-overlay-text">Opening Travalee</div>
                <div className="login-overlay-sub">Please wait a moment</div>
              </div>
            </div>
            <div className="login-meta">
              <span className="login-chip">Secure access</span>
              <span className="login-chip">Minimal UI</span>
              <span className="login-chip">Fast dashboard entry</span>
            </div>
            <div className="hint">Superadmin access only</div>
          </div>
        </div>
      </div>
    </>
  );
}