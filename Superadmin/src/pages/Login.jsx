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
          background: #f0f6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .login-card {
          background: #ffffff;
          border: 1px solid rgba(56,189,248,0.2);
          border-radius: 16px;
          box-shadow: 0 10px 34px rgba(2, 132, 199, 0.14);
          padding: 36px 32px;
          width: 100%;
          max-width: 430px;
        }
        .login-logo {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .login-logo span {
          font-size: 18px;
          font-family: 'Space Mono', monospace;
          color: #ffffff;
          font-weight: 700;
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
      `}</style>

      <div className="login-bg">
        <div className="login-card">
          <div className="login-logo">
            <span>SA</span>
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
      </div>
    </>
  );
}