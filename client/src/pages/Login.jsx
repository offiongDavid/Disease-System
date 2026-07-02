import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // HANDLE INPUTS
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // HANDLE LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/login",
        formData
      );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        response.data.token
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Login successful");

      // REDIRECT
      setTimeout(() => {

        navigate("/dashboard");

      }, 1500);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-4 py-6 overflow-hidden">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-5xl min-h-[680px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden grid lg:grid-cols-2 border border-slate-200">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0f766e] text-white p-10 flex-col justify-between overflow-hidden">

          {/* BACKGROUND GLOW */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>

          {/* CONTENT */}
          <div className="relative z-10">

            {/* LOGO */}
            <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 3h6v4h4v14H5V7h4V3zm2 2v2h2V5h-2z"
                />
              </svg>

            </div>

            {/* TITLE */}
            <div className="mt-10">

              <h1 className="text-4xl font-bold leading-tight">
                Smart Clinic
              </h1>

              <p className="mt-3 text-cyan-100 text-lg">
                Healthcare Prediction Platform
              </p>

            </div>

            {/* DESCRIPTION */}
            <p className="mt-8 text-slate-200 leading-8 text-[15px] max-w-md">

              Securely manage student consultations,
              clinic records, symptom analysis,
              and AI-assisted disease prediction
              from one centralized platform.

            </p>

          </div>

          {/* FEATURES */}
          <div className="relative z-10 space-y-4">

            <div className="flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">

              <div className="w-3 h-3 rounded-full bg-cyan-300"></div>

              <p className="text-sm tracking-wide">
                Secure Authentication System
              </p>

            </div>

            <div className="flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">

              <div className="w-3 h-3 rounded-full bg-cyan-300"></div>

              <p className="text-sm tracking-wide">
                Student Medical Records
              </p>

            </div>

            <div className="flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">

              <div className="w-3 h-3 rounded-full bg-cyan-300"></div>

              <p className="text-sm tracking-wide">
                AI-Based Disease Prediction
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 md:px-12 py-10 bg-white">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden flex justify-center mb-8">

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-600 flex items-center justify-center shadow-xl">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3h6v4h4v14H5V7h4V3zm2 2v2h2V5h-2z"
                  />
                </svg>

              </div>

            </div>

            {/* HEADER */}
            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-800">
                Login
              </h2>

              <p className="mt-2 text-slate-500 text-sm leading-6">
                Access your clinic dashboard and continue
                managing consultations and predictions.
              </p>

            </div>

            {/* MESSAGE */}
            {
              message && (
                <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm">
                  {message}
                </div>
              )
            }

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[54px] bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  required
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[54px] bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  required
                />

              </div>

              {/* OPTIONS */}
              <div className="flex items-center justify-between text-sm">

                <label className="flex items-center gap-2 text-slate-500">

                  <input type="checkbox" />

                  Remember me

                </label>

                <button
                  type="button"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-semibold text-[15px] shadow-lg transition duration-300 disabled:opacity-50"
              >

                {
                  loading
                    ? "Logging in..."
                    : "Login"
                }

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
                  Create Account
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