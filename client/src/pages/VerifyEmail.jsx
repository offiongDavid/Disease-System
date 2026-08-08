import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";
import { Mail, ShieldCheck, ActivitySquare, AlertCircle, CheckCircle2 } from "lucide-react";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // email comes from signup or login redirect
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const res = await API.post("/auth/verify-email", { email, code });
      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      setResending(true);
      setError("");
      const res = await API.post("/auth/resend-code", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl border border-slate-200 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 flex items-center justify-center">
            <ActivitySquare className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.15em] uppercase text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Email Verification
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Verify your email</h2>
          <p className="mt-2 text-slate-500 text-sm">
            Enter the 6-digit code we sent to your email address.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-5 flex items-start gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-[18px] h-[18px]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-[54px] bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full h-[54px] bg-slate-50 border border-slate-200 rounded-2xl px-5 text-center text-xl tracking-[0.5em] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-blue-700 font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend verification code"}
          </button>

          <p className="text-slate-500 text-sm">
            Already verified?{" "}
            <Link to="/login" className="text-blue-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;