
export default function Login({ onLogin }) {
  return (
    <>
      <style>{`
        .login-bg {
          min-height: 100vh;
          background: #f4f4f8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .login-card {
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 16px;
          padding: 48px 40px 40px;
          width: 100%;
          max-width: 380px;
        }
        .login-logo {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #1a1560;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .login-logo span {
          font-size: 22px;
          font-family: 'Space Mono', monospace;
          color: #e8ff47;
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
          color: #888;
          text-align: center;
          margin: 0 0 32px;
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
          border: 1px solid #e0e0e0;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #1a1a2e;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          margin-bottom: 20px;
        }
        .google-btn:hover {
          border-color: #1a1560;
          background: #f8f8ff;
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
          background: #e8e8e8;
        }
        .divider-text {
          font-size: 12px;
          color: #aaa;
        }
        .form-group {
          margin-bottom: 12px;
        }
        .form-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .form-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 9px;
          border: 1px solid #e0e0e0;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #0f0e1a;
          background: #fafafa;
          outline: none;
          transition: border 0.15s;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #1a1560;
          background: #fff;
        }
        .signin-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #1a1560;
          color: #e8ff47;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 4px;
        }
        .signin-btn:hover {
          background: #231c80;
        }
        .login-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 12px;
          color: #bbb;
        }
        .lock-icon {
          font-size: 12px;
        }
        .access-note {
          margin-top: 20px;
          background: #f5f3ff;
          border: 1px solid #e2deff;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 12px;
          color: #5a4a8a;
          line-height: 1.6;
          text-align: center;
        }
      `}</style>

      <div className="login-bg">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <span>LOL</span>
          </div>

          {/* Heading */}
          <h1 className="login-title">Welcome back</h1>
          <p className="login-sub">Sign in to access the superadmin<br />control center</p>

          {/* Google OAuth button */}
          <button className="google-btn" onClick={() => alert("Connect Supabase to enable Google login")}>
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
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="admin@yourproject.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••••" />
          </div>

          {/* Sign in button */}
          <button className="signin-btn" onClick={onLogin}>
            Sign in
          </button>

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