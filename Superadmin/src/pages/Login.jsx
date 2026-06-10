import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

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
      navigate("/dashboard", { replace: true });
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
        .login-loading-text {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }
        .login-loading-sub {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
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
                <label className="form-label">Super Admin Key</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="1234 5678 9012 3456"
                  value={form.superAdminKey}
                  onChange={onChange("superAdminKey")}
                  style={{ letterSpacing: "0.18em" }}
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
            <div className="login-loading-text">Opening Travalee</div>
            <div className="login-loading-sub">Please wait a moment</div>
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