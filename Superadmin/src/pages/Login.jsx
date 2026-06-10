import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import logoImage from "../assets/images/Logo.jpg";
import bannerImage from "../assets/images/Banner.jpg";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [form, setForm] = useState({ Username: "", password: "", superAdminKey: "" });
  const [loading, setLoading] = useState(false);
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

    try {
      await auth.login({
        Username: form.Username.trim(),
        password: form.password,
        superAdminKey: form.superAdminKey.trim() || undefined,
      });
      navigate("/dashboard/app/banners", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #eef7ff 0%, #f7fbff 52%, #eaf4ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .login-shell {
          width: min(100%, 980px);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 18px;
          align-items: stretch;
        }
        .login-card {
          background: #ffffff;
          border: 1px solid rgba(56,189,248,0.2);
          border-radius: 16px;
          box-shadow: 0 10px 34px rgba(2, 132, 199, 0.14);
          padding: 36px 32px;
          width: 100%;
        }
        .login-logo {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 12px 28px rgba(2, 132, 199, 0.18);
          animation: floaty 3.4s ease-in-out infinite;
        }
        .login-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .login-title {
          font-size: 28px;
          font-weight: 600;
          color: #0f172a;
          text-align: center;
          margin: 0 0 8px;
        }
        .login-sub {
          font-size: 15px;
          color: #64748b;
          text-align: center;
          margin: 0 0 24px;
        }
        .form-group {
          margin-bottom: 14px;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 7px;
        }
        .form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(14,116,144,0.2);
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0e1a;
          background: #ffffff;
          outline: none;
          transition: border 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }
        .signin-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: #0284c7;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 12px;
        }
        .signin-btn:hover {
          background: #0369a1;
        }
        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-box {
          margin-top: 8px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
          color: #991b1b;
        }
        .hint {
          margin-top: 16px;
          font-size: 13px;
          color: #64748b;
          text-align: center;
        }
        .brand-panel {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          min-height: 100%;
          border: 1px solid rgba(56,189,248,0.18);
          box-shadow: 0 20px 50px rgba(2, 132, 199, 0.12);
        }
        .brand-panel img {
          width: 100%;
          height: 100%;
          min-height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.02);
          animation: bannerDrift 9s ease-in-out infinite;
        }
        .brand-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 18%, rgba(255,255,255,0.14), transparent 28%),
            linear-gradient(180deg, rgba(15,23,42,0.08) 0%, rgba(2,132,199,0.18) 100%);
        }
        .brand-panel-text {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 18px;
          z-index: 1;
          color: #ffffff;
        }
        .brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(10px);
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .brand-panel-title {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 8px;
          text-shadow: 0 8px 24px rgba(15,23,42,0.25);
        }
        .brand-panel-sub {
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.95;
          max-width: 22rem;
        }
        .brand-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }
        .metric-card {
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.18);
        }
        .metric-label {
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .metric-value {
          font-size: 18px;
          font-weight: 700;
        }
        .brand-floating {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 2;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 12px 30px rgba(15,23,42,0.12);
          animation: floaty 3.8s ease-in-out infinite;
        }
        .brand-floating .floating-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .brand-floating .floating-value {
          font-size: 17px;
          font-weight: 700;
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.02); }
        }
        @keyframes bannerDrift {
          0%, 100% { transform: scale(1.02) translate3d(0, 0, 0); }
          50% { transform: scale(1.06) translate3d(-6px, -4px, 0); }
        }
        @media (max-width: 860px) {
          .login-shell {
            grid-template-columns: 1fr;
          }
          .brand-panel {
            min-height: 220px;
            order: -1;
          }
        }
      `}</style>

      <div className="login-bg">
        <div className="login-shell">
          <div className="login-card">
            <div className="login-logo">
              <img src={logoImage} alt="Superadmin logo" />
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">Enter your credentials to continue</p>

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
            <div className="hint">Superadmin access only</div>
          </div>
          <div className="brand-panel">
            <img src={bannerImage} alt="Travalee superadmin banner" />
            <div className="brand-floating">
              <div className="floating-title">Live status</div>
              <div className="floating-value">Superadmin ready</div>
            </div>
            <div className="brand-panel-text">
              <div className="brand-tag">Control Center</div>
              <div className="brand-panel-title">Travalee Superadmin</div>
              <div className="brand-panel-sub">Manage app content, hotels, and system controls from one clean dashboard.</div>
              <div className="brand-metrics">
                <div className="metric-card">
                  <div className="metric-label">Modules</div>
                  <div className="metric-value">05</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Access</div>
                  <div className="metric-value">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}