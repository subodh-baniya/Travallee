import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";

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
          background: radial-gradient(circle at 8% 10%, #e0f2fe 0, #eaf6ff 30%, #f0f6ff 62%, #f8fbff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .login-card {
          background: linear-gradient(180deg, #ffffff 0%, #fbfeff 100%);
          border: 1px solid rgba(56,189,248,0.22);
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(14, 116, 144, 0.16);
          padding: 42px 36px 34px;
          width: 100%;
          max-width: 430px;
        }
        .login-logo {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: linear-gradient(160deg, #0ea5e9, #0369a1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 10px 24px rgba(2,132,199,0.25);
        }
        .login-logo span {
          font-size: 22px;
          font-family: 'Space Mono', monospace;
          color: #ecfeff;
          font-weight: 700;
        }
        .login-title {
          font-size: 22px;
          font-weight: 600;
          color: #0f0e1a;
          text-align: center;
          margin: 0 0 6px;
        }
        .login-sub {
          font-size: 13px;
          color: #64748b;
          text-align: center;
          margin: 0 0 24px;
          line-height: 1.6;
        }
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid rgba(14,116,144,0.18);
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          margin-bottom: 20px;
        }
        .google-btn:hover {
          border-color: #0284c7;
          background: #f0f9ff;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .divider-line {
          flex: 1;
          height: 0.5px;
          background: #dbeafe;
        }
        .divider-text {
          font-size: 12px;
          color: #94a3b8;
        }
        .form-group {
          margin-bottom: 12px;
        }
        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 9px;
          border: 1px solid rgba(14,116,144,0.2);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0e1a;
          background: #f8fbff;
          outline: none;
          transition: border 0.15s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #0284c7;
          background: #fff;
        }
        .signin-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #0284c7 0%, #0369a1 100%);
          color: #ecfeff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 8px;
          box-shadow: 0 10px 24px rgba(3,105,161,0.25);
        }
        .signin-btn:hover {
          filter: brightness(1.04);
        }
        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 12px;
          color: #94a3b8;
        }
        .lock-icon {
          font-size: 12px;
        }
        .access-note {
          margin-top: 20px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 12px;
          color: #0369a1;
          line-height: 1.6;
          text-align: center;
        }
        .brand-strip {
          margin-bottom: 18px;
          border: 1px solid rgba(2,132,199,0.18);
          background: rgba(224,242,254,0.55);
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 12px;
          color: #0369a1;
          text-align: center;
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="login-bg">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <span>LOL</span>
          </div>

          <div className="brand-strip">Travalee Superadmin Gateway</div>

          {/* Heading */}
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to access the superadmin<br />control center</p>

          {/* Google OAuth button */}
          <button className="google-btn" type="button" onClick={() => alert("Google login is not enabled yet") }>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or sign in with email</span>
            <div className="divider-line" />
          </div>

          {/* Email + Password */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="superadmin_username"
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
                placeholder="Enter password"
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
                placeholder="Enter super admin key"
                value={form.superAdminKey}
                onChange={onChange("superAdminKey")}
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="access-note" style={{ marginTop: 8, borderColor: "#fecaca", background: "#fef2f2", color: "#991b1b" }}>
                {error}
              </div>
            )}

            <button className="signin-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Access note */}
          <div className="access-note">
             Authorized accounts only. Unauthorized access is blocked.
          </div>

          {/* Footer */}
          <div className="login-footer">
            <span className="lock-icon">⚙️</span>
            Superadmin Control Center · v1.0
          </div>

        </div>
      </div>
    </>
  );
}