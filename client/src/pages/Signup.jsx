import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // PASSWORD CHECK
    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match");

      return;

    }

    // PASSWORD LENGTH
    if (formData.password.length < 6) {

      setError("Password must be at least 6 characters");

      return;

    }

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccess(response.data.message);

      // CLEAR FORM
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // REDIRECT
      setTimeout(() => {

        navigate("/login");

      }, 2000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-4 py-6 overflow-hidden">

      {/* MAIN CARD */}
      <div className="w-full max-w-5xl min-h-[88vh] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden grid lg:grid-cols-2 border border-slate-200">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between relative bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#0369a1] text-white p-10 overflow-hidden">

          {/* BACKGROUND EFFECTS */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>

          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>

          {/* TOP CONTENT */}
          <div className="relative z-10">

            {/* LOGO */}
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-lg">

              <div className="w-8 h-8 rounded-lg bg-cyan-400"></div>

            </div>

            {/* TITLE */}
            <div className="mt-10">

              <p className="text-cyan-300 text-sm font-semibold tracking-[0.2em] uppercase">
                Smart Clinic
              </p>

              <h1 className="mt-4 text-5xl font-bold leading-tight">
                Create Your Staff Account
              </h1>

              <p className="mt-6 text-slate-300 leading-8 text-base max-w-md">

                Register authorized clinic staff
                and gain access to consultations,
                student records, AI predictions,
                and healthcare analytics.

              </p>

            </div>

          </div>

          {/* FEATURE CARDS */}
          <div className="relative z-10 space-y-4">

            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">

              <h3 className="font-semibold text-white">
                Student Consultation System
              </h3>

              <p className="text-sm text-slate-300 mt-1 leading-6">
                Manage consultations and student medical history securely.
              </p>

            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm">

              <h3 className="font-semibold text-white">
                AI Disease Prediction
              </h3>

              <p className="text-sm text-slate-300 mt-1 leading-6">
                Analyze symptoms and generate intelligent recommendations.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 md:px-12 py-8 bg-white overflow-y-auto">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="lg:hidden flex justify-center mb-8">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 flex items-center justify-center shadow-lg">

                <div className="w-7 h-7 rounded-lg bg-white"></div>

              </div>

            </div>

            {/* HEADER */}
            <div className="mb-8">

              <h2 className="text-4xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="mt-2 text-slate-500">
                Register clinic staff access
              </p>

            </div>

            {/* ERROR */}
            {
              error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )
            }

            {/* SUCCESS */}
            {
              success && (
                <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
                  {success}
                </div>
              )
            }

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  required
                />

              </div>

              {/* EMAIL */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  required
                />

              </div>

              {/* PASSWORD */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  required
                />

              </div>

              {/* CONFIRM PASSWORD */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  required
                />

              </div>

              {/* TERMS */}
              <div className="flex items-start gap-3 text-sm text-slate-500 leading-6">

                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-blue-700"
                />

                <p>
                  I agree to the clinic system terms,
                  privacy policy, and staff authentication policy.
                </p>

              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-semibold text-base shadow-lg transition duration-300 disabled:opacity-50"
              >

                {
                  loading
                    ? "Creating Account..."
                    : "Create Account"
                }

              </button>

            </form>

            {/* LOGIN LINK */}
            <div className="mt-8 text-center">

              <p className="text-slate-500">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Login
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Signup;