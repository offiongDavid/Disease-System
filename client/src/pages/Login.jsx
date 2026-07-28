import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Info,
  ActivitySquare,
  ShieldCheck,
  FileHeart,
  Brain,
} from "lucide-react";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      setLoading(true);

      const response = await API.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl min-h-[680px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden grid lg:grid-cols-2 border border-slate-200">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0f766e] text-white p-10 flex-col justify-between overflow-hidden">
          {/* BACKGROUND GLOW */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl" />

          {/* CONTENT */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                <ActivitySquare className="w-7 h-7 text-cyan-300" strokeWidth={2} />
              </div>
              <div>
                <p className="text-cyan-300 text-xs font-semibold tracking-[0.25em] uppercase">
                  Smart Clinic
                </p>
                <p className="text-slate-400 text-xs mt-0.5">Staff Portal</p>
              </div>
            </div>

            <h1 className="mt-10 text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Welcome back
            </h1>

            <p className="mt-5 text-slate-300 leading-7 text-base max-w-sm">
              Log in to manage student consultations, clinic records,
              symptom analysis, and AI-assisted disease prediction — all
              from one dashboard.
            </p>
          </div>

          {/* SIGNATURE ELEMENT: live vitals line */}
          <div className="relative z-10 my-8">
            <svg
              viewBox="0 0 400 60"
              className="w-full h-14 overflow-visible"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,30 60,30 80,30 92,10 104,50 116,5 128,30 160,30 180,30 195,18 210,42 225,30 260,30 400,30"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              >
                <animate
                  attributeName="stroke-dasharray"
                  from="0,800"
                  to="800,0"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </polyline>
            </svg>
            <p className="text-[11px] tracking-[0.2em] uppercase text-slate-400 mt-1">
              System status — Online
            </p>
          </div>

          {/* FEATURES */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-cyan-300 shrink-0" />
              <p className="text-sm tracking-wide">
                Secure authentication system
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
              <FileHeart className="w-5 h-5 text-cyan-300 shrink-0" />
              <p className="text-sm tracking-wide">
                Student medical records
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">
              <Brain className="w-5 h-5 text-cyan-300 shrink-0" />
              <p className="text-sm tracking-wide">
                AI-based disease prediction
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 md:px-12 py-10 bg-white">
          <div className="w-full max-w-md">
            {/* MOBILE LOGO */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 flex items-center justify-center shadow-lg">
                <ActivitySquare className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Access
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Log in
              </h2>
              <p className="mt-2 text-slate-500 text-sm leading-6">
                Access your clinic dashboard and continue managing
                consultations and predictions.
              </p>
            </div>

            {/* MESSAGE */}
            {message && (
              <div className="mb-5 flex items-start gap-2.5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-[54px] bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-[54px] bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-12 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue-700 w-4 h-4"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-semibold text-[15px] shadow-lg shadow-blue-900/10 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* SIGNUP */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
