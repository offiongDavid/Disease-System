import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";
import { exportToExcel, exportToPDF } from "../utils/exportReports";

import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  FileText,
  LogOut,
  Activity,
  ShieldCheck,
  Stethoscope,
  Bell,
  Plus,
  ClipboardList,
  Menu,
  X,
  RefreshCw,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudents(res.data.students || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load + real-time polling every 20 seconds
  useEffect(() => {
    fetchStudents();

    const interval = setInterval(() => {
      fetchStudents();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchStudents]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // =============== CALCULATIONS ===============
  const totalConsultations = students.reduce(
    (total, student) => total + (student.consultations?.length || 0),
    0
  );

  const totalPredictions = totalConsultations;

  const criticalCases = students.reduce(
    (total, student) =>
      total +
      (student.consultations?.filter(
        (c) => c.confidence === "High" || c.confidence === "Critical"
      ).length || 0),
    0
  );

  // Recent consultations (last 6)
  const recentConsultations = students
    .flatMap((student) =>
      (student.consultations || []).map((consultation) => ({
        ...consultation,
        studentName: student.name,
      }))
    )
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 6);

  // Disease Analytics
  const diseaseCounts = {};
  students.forEach((student) => {
    student.consultations?.forEach((c) => {
      const disease = c.predictedDisease || "Unknown";
      diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
    });
  });

  const diseaseChartData = Object.keys(diseaseCounts)
    .map((disease) => ({
      name: disease.length > 12 ? disease.slice(0, 12) + "…" : disease,
      fullName: disease,
      cases: diseaseCounts[disease],
    }))
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 6);

  // Pie data
  const pieData = [
    { name: "Normal", value: Math.max(totalConsultations - criticalCases, 0) },
    { name: "Critical", value: criticalCases },
  ];
  const COLORS = ["#2563eb", "#ef4444"];

  // Real Weekly Trend (last 7 days)
  const getWeeklyData = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      let count = 0;
      students.forEach((student) => {
        student.consultations?.forEach((c) => {
          const cDate = new Date(c.createdAt || c.date);
          if (cDate >= date && cDate < nextDay) count++;
        });
      });

      result.push({
        day: days[date.getDay()],
        consultations: count,
      });
    }
    return result;
  };

  const weeklyData = getWeeklyData();

  // =============== RENDER ===============
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px]
          bg-[#0f172a] text-white px-6 py-7 border-r border-slate-800
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Activity size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">Smart Clinic</h1>
                <p className="text-slate-400 text-sm">Prediction System</p>
              </div>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Menu */}
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 bg-blue-600 text-white px-5 py-4 rounded-2xl">
              <LayoutDashboard size={22} />
              <div className="text-left">
                <h2 className="font-semibold">Dashboard</h2>
                <p className="text-xs text-blue-100">Clinic overview</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/new-consultation")}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Stethoscope size={22} />
              <div className="text-left">
                <h2 className="font-semibold">New Consultation</h2>
              </div>
            </button>

            <button
              onClick={() => navigate("/students")}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Users size={22} />
              <div className="text-left">
                <h2 className="font-semibold">Check-in Records</h2>
              </div>
            </button>

            <button
              onClick={() => navigate("/records")}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <FileText size={22} />
              <div className="text-left">
                <h2 className="font-semibold">Students Records</h2>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-4 rounded-2xl font-semibold transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* Topbar */}
        <div className="bg-white rounded-3xl border border-slate-200 px-4 md:px-6 py-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Clinic Dashboard
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                Welcome back,{" "}
                <span className="font-semibold text-blue-700">{user?.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : "Live"}
            </div>

            <button
              onClick={() => fetchStudents(true)}
              className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
              title="Refresh now"
            >
              <RefreshCw
                size={18}
                className={`text-slate-600 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <NotificationBell />

            <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-3 py-2">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden md:block">
                <h2 className="font-semibold text-slate-800 text-sm">
                  {user?.name}
                </h2>
                <p className="text-xs text-slate-500">Clinic Staff</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-8 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="uppercase tracking-[3px] text-blue-100 text-sm mb-3">
              Smart Consultation Workflow
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight max-w-2xl">
              Start a new student consultation and generate AI disease predictions
            </h2>
          </div>

          <button
            onClick={() => navigate("/new-consultation")}
            className="bg-white text-blue-700 hover:bg-slate-100 transition px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shrink-0"
          >
            <Plus size={22} />
            New Consultation
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
          <StatCard
            title="Registered Students"
            value={students.length}
            icon={<Users size={26} className="text-blue-700" />}
            bg="bg-blue-100"
          />
          <StatCard
            title="AI Predictions"
            value={totalPredictions}
            icon={<BrainCircuit size={26} className="text-cyan-700" />}
            bg="bg-cyan-100"
          />
          <StatCard
            title="Consultations"
            value={totalConsultations}
            icon={<ClipboardList size={26} className="text-green-700" />}
            bg="bg-green-100"
          />
          <StatCard
            title="Critical Cases"
            value={criticalCases}
            icon={<ShieldCheck size={26} className="text-red-600" />}
            bg="bg-red-100"
          />
        </div>

        {/* Export Reports */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800">Export Reports</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Download clinic consultation data
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportToExcel(students)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl font-semibold text-sm transition"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>

            <button
              onClick={() => exportToPDF(students)}
              className="flex items-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-semibold text-sm transition"
            >
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Disease Analytics
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Top predicted diseases
              </p>
            </div>

            {diseaseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={diseaseChartData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      value,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar
                    dataKey="cases"
                    fill="#2563eb"
                    radius={[8, 8, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
                No disease data yet
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Critical Overview
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Consultation severity
              </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart + Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* Weekly Trend */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Weekly Consultation Trend
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Real activity over the last 7 days
              </p>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consultations"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#06b6d4" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Recent Activity
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Latest consultations
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[320px]">
              {recentConsultations.length > 0 ? (
                recentConsultations.map((c, idx) => (
                  <div
                    key={c._id || idx}
                    className="border border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-sm text-slate-800">
                          {c.studentName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {c.predictedDisease || "No prediction"}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold ${c.confidence === "High" || c.confidence === "Critical"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                          }`}
                      >
                        {c.confidence || "Normal"}
                      </span>
                    </div>

                    {c.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {c.symptoms.slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-400 text-sm">
                  No consultation records yet
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/records")}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3.5 rounded-2xl font-semibold shadow-lg"
            >
              View All Records
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, bg }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>
          <h2 className="text-4xl font-bold text-slate-800 mt-3">{value}</h2>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;