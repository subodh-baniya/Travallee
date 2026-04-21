import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';


const NOT_ADMIN_REDIRECT_URL = 'https://your-link-here.com';
// ──────────────────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Detect if input is email or username
      const isEmail = email.includes('@');
      const payload: any = { password };
      
      if (isEmail) {
        payload.email = email;
      } else {
        payload.Username = email;
      }
      
      const response = await api.post('/users/login', payload);
      if (response.data?.data) {
        const userData = response.data.data;
        const { token } = userData;
        if (userData.role?.toLowerCase() === 'admin') {
          login(userData, token);
          navigate('/dashboard');
        } else {
          setError('Access denied: Hotel Admin access required');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Jost', sans-serif;
          background: #0b0c0f;
          overflow: hidden;
        }

        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          position: relative;
          z-index: 1;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(180,145,90,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 80% 20%, rgba(180,145,90,0.07) 0%, transparent 60%),
            linear-gradient(135deg, #0e0f13 0%, #131418 50%, #0b0c0f 100%);
          z-index: -1;
        }

        .login-left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(180,145,90,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,145,90,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: -1;
        }

        .card {
          width: 100%;
          max-width: 460px;
          position: relative;
        }

        .card::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(180,145,90,0.5), rgba(180,145,90,0.05) 40%, transparent 60%, rgba(180,145,90,0.15));
          z-index: 0;
        }

        .card-inner {
          position: relative;
          z-index: 1;
          background: rgba(16, 17, 21, 0.92);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 3rem 2.75rem;
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .logo-img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          filter: brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg);
        }

        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          color: #c9a96e;
          text-transform: uppercase;
        }

        .heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          font-weight: 300;
          color: #f0ece4;
          line-height: 1.1;
          margin: 0 0 0.5rem;
        }

        .heading em {
          font-style: italic;
          color: #c9a96e;
        }

        .subheading {
          font-size: 0.9rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          color: rgba(200,190,170,0.6);
          text-transform: uppercase;
          margin-bottom: 2.25rem;
        }

        .divider {
          width: 2.5rem;
          height: 1px;
          background: linear-gradient(90deg, #c9a96e, transparent);
          margin-bottom: 2.25rem;
        }

        .field {
          margin-bottom: 1.4rem;
        }

        .field label {
          display: block;
          font-size: 0.76rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(200,190,170,0.65);
          margin-bottom: 0.55rem;
        }

        .field input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(180,145,90,0.2);
          border-radius: 8px;
          padding: 0.9rem 1.1rem;
          color: #f0ece4;
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          letter-spacing: 0.04em;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
        }

        .field input::placeholder {
          color: rgba(200,190,170,0.22);
        }

        .field input:focus {
          border-color: rgba(180,145,90,0.55);
          background: rgba(255,255,255,0.055);
          box-shadow: 0 0 0 3px rgba(180,145,90,0.08);
        }

        .error-msg {
          font-size: 0.88rem;
          font-weight: 300;
          color: #e07070;
          background: rgba(224,112,112,0.07);
          border: 1px solid rgba(224,112,112,0.18);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          margin-bottom: 1.25rem;
          letter-spacing: 0.02em;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem 1rem;
          background: linear-gradient(135deg, #c9a96e 0%, #a8844d 100%);
          color: #0b0c0f;
          font-family: 'Jost', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-bottom: 1.75rem;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          border-radius: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(180,145,90,0.28);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 13px;
          height: 13px;
          border: 2px solid rgba(11,12,15,0.3);
          border-top-color: #0b0c0f;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-note {
          text-align: center;
          font-size: 0.84rem;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: rgba(200,190,170,0.4);
        }

        .footer-note a {
          color: #c9a96e;
          text-decoration: none;
          border-bottom: 1px solid rgba(180,145,90,0.3);
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }

        .footer-note a:hover {
          color: #e0c080;
          border-color: rgba(224,192,128,0.6);
        }

        .login-right {
          width: 42%;
          position: relative;
          overflow: hidden;
          display: none;
        }

        @media (min-width: 900px) {
          .login-right { display: block; }
        }

        .login-right img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.35;
          filter: sepia(0.3) saturate(0.8);
        }

        .login-right::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            #0b0c0f 0%,
            rgba(11,12,15,0.4) 40%,
            rgba(11,12,15,0.1) 100%
          );
        }

        .right-caption {
          position: absolute;
          bottom: 3rem;
          right: 2.5rem;
          z-index: 1;
          text-align: right;
        }

        .right-caption p {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.65rem;
          font-weight: 300;
          color: rgba(240,236,228,0.6);
          margin: 0 0 0.25rem;
          line-height: 1.4;
        }

        .right-caption span {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(180,145,90,0.5);
        }
      `}</style>

      <div className="login-root">
        <div className="login-left">
          <div className="card">
            <div className="card-inner">

              <div className="logo-wrap">
                <img src="/Logo.png" alt="Travallee" className="logo-img" />
                <span className="logo-text">Travallee</span>
              </div>

              <h1 className="heading">Hotel <em>Admin</em></h1>
              <p className="subheading">Property Management Portal</p>
              <div className="divider" />

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="email">Email or Username</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="username or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                {error && <p className="error-msg">{error}</p>}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading && <span className="spinner" />}
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <p className="footer-note">
                Not a hotel admin?{' '}
                <a href={NOT_ADMIN_REDIRECT_URL} target="_blank" rel="noopener noreferrer">
                  Contact super admin
                </a>
              </p>

            </div>
          </div>
        </div>

        <div className="login-right">
          <img src="/hotel-bg.jpg" alt="" aria-hidden="true" />
          <div className="right-caption">
            <p>"Curated stays,<br />effortless management."</p>
            <span>Travallee · Property Suite</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;