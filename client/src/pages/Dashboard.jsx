import { useEffect, useState } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

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
  ChevronRight,
  UserRound,
  Menu,
  X,
} from 'lucide-react';

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
} from 'recharts';

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const [students, setStudents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(`https://disease-system-production-80d4.up.railway.app/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(res.data.students || []);
    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');
  };

  // TOTAL CONSULTATIONS
  const totalConsultations = students.reduce(
    (total, student) => total + (student.consultations?.length || 0),

    0
  );

  // AI PREDICTIONS
  const totalPredictions = totalConsultations;

  // CRITICAL CASES
  const criticalCases = students.reduce(
    (total, student) =>
      total +
      (student.consultations?.filter(
        (consultation) => consultation.confidence === 'High'
      ).length || 0),

    0
  );

  // RECENT CONSULTATIONS
  const recentConsultations = students
    .flatMap((student) =>
      (student.consultations || []).map((consultation) => ({
        ...consultation,

        studentName: student.name,
      }))
    )
    .slice(-5)
    .reverse();

  // DISEASE ANALYTICS
  const diseaseCounts = {};

  students.forEach((student) => {
    student.consultations?.forEach((consultation) => {
      const disease = consultation.predictedDisease || 'Unknown';

      diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
    });
  });

  const diseaseChartData = Object.keys(diseaseCounts).map((disease) => ({
    name: disease,

    cases: diseaseCounts[disease],
  }));

  // PIE CHART DATA
  const pieData = [
    {
      name: 'Consultations',
      value: totalConsultations,
    },

    {
      name: 'Critical',
      value: criticalCases,
    },
  ];

  const COLORS = ['#2563eb', '#ef4444'];

  // WEEKLY MOCK DATA
  const weeklyData = [
    { day: 'Mon', consultations: 4 },
    { day: 'Tue', consultations: 6 },
    { day: 'Wed', consultations: 3 },
    { day: 'Thu', consultations: 8 },
    { day: 'Fri', consultations: 5 },
    { day: 'Sat', consultations: 2 },
    { day: 'Sun', consultations: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* SIDEBAR */}
      {/* MOBILE OVERLAY */}
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
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          {/* LOGO */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Activity size={28} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  Smart Clinic
                </h1>

                <p className="text-slate-400 text-sm">Prediction System</p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* MENU */}
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 bg-blue-600 text-white px-5 py-4 rounded-2xl transition">
              <LayoutDashboard size={22} />

              <div className="text-left">
                <h2 className="font-semibold">Dashboard</h2>

                <p className="text-xs text-blue-100">Clinic overview</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/new-consultation')}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Stethoscope size={22} />

              <div className="text-left">
                <h2 className="font-semibold">New Consultation</h2>
              </div>
            </button>

            <button
              onClick={() => navigate('/students')}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Users size={22} />

              <div className="text-left">
                <h2 className="font-semibold">Check-in Records</h2>
              </div>
            </button>

            <button
              onClick={() => navigate('/records')}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <FileText size={22} />

              <div className="text-left">
                <h2 className="font-semibold">Students Records</h2>
              </div>
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-4 rounded-2xl font-semibold transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* MAIN */}
     <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* TOPBAR */}
        <div className="bg-white rounded-3xl border border-slate-200 px-4 md:px-6 py-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
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
                Welcome back,
                <span className="font-semibold text-blue-700">
                  {' '}
                  {user?.name}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Bell size={20} className="text-slate-600" />
            </button>

            <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-3 py-2">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)}
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

        {/* HERO */}
        <div className="mt-8 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="uppercase tracking-[3px] text-blue-100 text-sm mb-3">
              Smart Consultation Workflow
            </p>

            <h2 className="text-3xl lg:text-4xl font-bold leading-tight max-w-2xl">
              Start a new student consultation and generate AI disease
              predictions
            </h2>
          </div>

          <button
            onClick={() => navigate('/new-consultation')}
            className="bg-white text-blue-700 hover:bg-slate-100 transition px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg"
          >
            <Plus size={22} />
            New Consultation
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {/* CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Registered Students</p>

                <h2 className="text-4xl font-bold text-slate-800 mt-3">
                  {students.length}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users size={26} className="text-blue-700" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">AI Predictions</p>

                <h2 className="text-4xl font-bold text-slate-800 mt-3">
                  {totalPredictions}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <BrainCircuit size={26} className="text-cyan-700" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Consultations</p>

                <h2 className="text-4xl font-bold text-slate-800 mt-3">
                  {totalConsultations}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <ClipboardList size={26} className="text-green-700" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">Critical Cases</p>

                <h2 className="text-4xl font-bold text-slate-800 mt-3">
                  {criticalCases}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <ShieldCheck size={26} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* BAR CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 px-4 md:px-6 py-5 shadow-sm flex items-center justify-between gap-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Disease Analytics
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Predicted disease distribution
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={diseaseChartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="cases" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="bg-white rounded-3xl border border-slate-200 px-4 md:px-6 py-5 shadow-sm flex items-center justify-between gap-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Critical Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Consultation severity overview
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART + RECENT ACTIVITIES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
          {/* LINE CHART */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Weekly Consultation Trend
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Clinic activity across the week
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="consultations"
                  stroke="#06b6d4"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* RECENT ACTIVITIES */}
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

              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            <div className="space-y-4 flex-1">
              {recentConsultations.length > 0 ? (
                recentConsultations.map((consultation) => (
                  <div
                    key={consultation._id}
                    className="border border-slate-200 rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-sm text-slate-800">
                          {consultation.studentName}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {consultation.predictedDisease}
                        </p>
                      </div>

                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-xl text-[11px] font-semibold">
                        {consultation.confidence}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {consultation.symptoms
                        ?.slice(0, 3)
                        .map((symptom, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px]"
                          >
                            {symptom}
                          </span>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500 text-sm">
                  No consultation records yet
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/records')}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-2xl font-semibold shadow-lg"
            >
              View All Records
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
