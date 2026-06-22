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
    <div className="min-h-screen flex items-center justify-center font-sans p-6 relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_30%),linear-gradient(160deg,#f8fbff_0%,#eef7ff_48%,#e7f1fb_100%)]">
      {/* Decorative Background Circles */}
      <div className="absolute w-[260px] h-[260px] rounded-full blur-md opacity-50 pointer-events-none -left-[90px] -bottom-[110px] bg-[rgba(186,230,253,0.55)]" />
      <div className="absolute w-[220px] h-[220px] rounded-full blur-md opacity-50 pointer-events-none -right-[80px] -top-[90px] bg-[rgba(191,219,254,0.45)]" />

      <div className="w-full max-w-[460px] relative z-10">
        <div className="bg-white/86 border border-slate-400/18 rounded-[28px] shadow-[0_24px_80px_rgba(15,23,42,0.12)] pt-[34px] px-[30px] pb-[26px] w-full backdrop-blur-[18px] relative overflow-hidden">
          {/* Card top light gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/55 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-[30px] font-bold text-slate-900 text-center mb-2.5 tracking-tight">Superadmin Login</h1>
            <p className="text-sm text-slate-500 text-center mb-[26px]">Sign in to continue to the control center</p>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-[0.09em] mb-2">Username</label>
                <input
                  className="w-full py-[13px] px-3.5 rounded-[14px] border border-slate-400/22 text-sm text-slate-900 bg-white/92 outline-none transition-all duration-180 box-border focus:border-brand-accent focus:shadow-[0_0_0_4px_rgba(2,132,199,0.12)] focus:-translate-y-[1px]"
                  type="text"
                  placeholder="Enter your superadmin username"
                  value={form.Username}
                  onChange={onChange("Username")}
                  autoComplete="username"
                />
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-[0.09em] mb-2">Password</label>
                <input
                  className="w-full py-[13px] px-3.5 rounded-[14px] border border-slate-400/22 text-sm text-slate-900 bg-white/92 outline-none transition-all duration-180 box-border focus:border-brand-accent focus:shadow-[0_0_0_4px_rgba(2,132,199,0.12)] focus:-translate-y-[1px]"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="current-password"
                />
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-[0.09em] mb-2">Super Admin Key</label>
                <input
                  className="w-full py-[13px] px-3.5 rounded-[14px] border border-slate-400/22 text-sm text-slate-900 bg-white/92 outline-none transition-all duration-180 box-border focus:border-brand-accent focus:shadow-[0_0_0_4px_rgba(2,132,199,0.12)] focus:-translate-y-[1px]"
                  type="password"
                  placeholder="1234 5678 9012 3456"
                  value={form.superAdminKey}
                  onChange={onChange("superAdminKey")}
                  style={{ letterSpacing: "0.18em" }}
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="mt-2.5 border border-red-200 bg-red-50 rounded-[14px] p-[10px_12px] text-[13px] text-red-800">
                  {error}
                </div>
              )}

              <button 
                className="w-full p-3.5 rounded-[14px] border-none bg-gradient-to-br from-brand-accent to-[#0369a1] text-white text-[15px] font-bold cursor-pointer transition-all duration-180 mt-3.5 shadow-[0_14px_30px_rgba(2,132,199,0.22)] hover:-translate-y-[1px] hover:shadow-[0_18px_36px_rgba(2,132,199,0.26)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" 
                type="submit" 
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            
            {loading && (
              <div className="text-center mt-4">
                <div className="text-sm font-semibold text-slate-900">Opening Travalee</div>
                <div className="text-xs text-slate-500 mt-1">Please wait a moment</div>
              </div>
            )}

            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              <span className="py-1.75 px-[11px] rounded-full bg-white/70 border border-slate-400/18 text-[11px] text-slate-600">Secure access</span>
              <span className="py-1.75 px-[11px] rounded-full bg-white/70 border border-slate-400/18 text-[11px] text-slate-600">Minimal UI</span>
              <span className="py-1.75 px-[11px] rounded-full bg-white/70 border border-slate-400/18 text-[11px] text-slate-600">Fast dashboard entry</span>
            </div>
            <div className="mt-4.5 text-xs text-slate-500 text-center tracking-[0.04em]">Superadmin access only</div>
          </div>
        </div>
      </div>
    </div>
  );
}