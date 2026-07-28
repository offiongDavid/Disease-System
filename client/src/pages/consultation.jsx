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
  Stethoscope,
  Search,
  ShieldAlert,
  Trash2,
  Menu,
  X,
  ChevronUp,
} from 'lucide-react';

function Students() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState('');

  const [mobileMenu, setMobileMenu] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  // SHOW SCROLL BUTTON
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        `https://disease-system-production-80d4.up.railway.app/api/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.students || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteConsultation = async (
    consultationId
  ) => {
    const confirmDelete = window.confirm(
      'Delete this consultation?'
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `https://disease-system-production-80d4.up.railway.app/api/students/consultation/${consultationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchStudents();
    } catch (error) {
      console.log(error);

      alert('Failed to delete consultation');
    }
  };

  const handleDeleteStudent = async (
    studentId
  ) => {
    const confirmDelete = window.confirm(
      'Delete this student and all consultations?'
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `https://disease-system-production-80d4.up.railway.app/api/students/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchStudents();
    } catch (error) {
      console.log(error);

      alert('Failed to delete student');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');
  };

  // SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const filteredStudents = (
    students || []
  ).filter((student) =>
    student.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen lg:h-auto
          w-[280px]
          bg-[#0f172a]
          text-white
          px-6 py-7
          border-r border-slate-800
          flex flex-col justify-between
          transform transition-transform duration-300
          ${
            mobileMenu
              ? 'translate-x-0'
              : '-translate-x-full'
          }
          lg:translate-x-0
        `}
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

                <p className="text-slate-400 text-sm">
                  Prediction System
                </p>
              </div>
            </div>

            {/* CLOSE BUTTON */}
            <button
              className="lg:hidden"
              onClick={() =>
                setMobileMenu(false)
              }
            >
              <X size={28} />
            </button>
          </div>

          {/* MENU */}
          <div className="space-y-3">
            {/* DASHBOARD */}
            <button
              onClick={() => {
                navigate('/dashboard');

                setMobileMenu(false);
              }}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <LayoutDashboard size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  Dashboard
                </h2>

                <p className="text-xs text-slate-400">
                  Clinic overview
                </p>
              </div>
            </button>

            {/* NEW CONSULTATION */}
            <button
              onClick={() => {
                navigate(
                  '/new-consultation'
                );

                setMobileMenu(false);
              }}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Stethoscope size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  New Consultation
                </h2>
              </div>
            </button>

            {/* STUDENTS ACTIVE */}
            <button className="w-full flex items-center gap-4 bg-blue-600 text-white px-5 py-4 rounded-2xl transition">
              <Users size={22} />

              <div className="text-left">
                <h2 className="font-semibold text-1xl">
                  Check-in Records
                </h2>
              </div>
            </button>

            {/* RECORDS */}
            <button
              onClick={() => {
                navigate('/records');

                setMobileMenu(false);
              }}
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <FileText size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  Students Records
                </h2>
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
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* MOBILE TOPBAR */}
        <div className="flex items-center justify-between mb-5 lg:hidden">
          <button
            onClick={() =>
              setMobileMenu(true)
            }
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm"
          >
            <Menu size={24} />
          </button>

          <div className="text-right">
            <h2 className="font-bold text-slate-800 text-sm">
              {user?.name}
            </h2>

            <p className="text-xs text-slate-500">
              Clinic Staff
            </p>
          </div>
        </div>

        {/* TOPBAR */}
        <div className="bg-white rounded-3xl border border-slate-200 px-4 sm:px-6 py-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Consultation Management
            </h1>

            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              consultations & analytics
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex items-center bg-slate-100 px-4 py-3 rounded-2xl w-full lg:w-[320px]">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-transparent outline-none ml-3 w-full text-sm"
            />
          </div>
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {/* TOTAL */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  Total Students
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3">
                  {students.length}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users
                  size={26}
                  className="text-blue-700"
                />
              </div>
            </div>
          </div>

          {/* CONSULTATIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  Consultations
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3">
                  {students.reduce(
                    (total, student) =>
                      total +
                      (student.consultations
                        ?.length || 0),
                    0
                  )}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center">
                <Activity
                  size={26}
                  className="text-cyan-700"
                />
              </div>
            </div>
          </div>

          {/* AI */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm">
                  AI Predictions
                </p>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-3">
                  {students.reduce(
                    (total, student) =>
                      total +
                      (student.consultations
                        ?.length || 0),
                    0
                  )}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <BrainCircuit
                  size={26}
                  className="text-green-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STUDENTS */}
        <div className="mt-8 space-y-6">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7"
            >
              {/* HEADER */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">
                    {student.name}
                  </h2>

                  <p className="text-slate-500 mt-1 text-sm sm:text-base">
                    {student.department}
                    {' • '}
                    Level {student.level}
                  </p>

                  <p className="text-sm text-slate-400 mt-1 break-all">
                    {student.matricNumber}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-blue-50 text-blue-700 px-5 py-3 rounded-2xl font-semibold text-sm">
                    {student.consultations
                      ?.length || 0}{' '}
                    Consultation(s)
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteStudent(
                        student._id
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* CONSULTATIONS */}
              <div className="mt-6 space-y-5">
                {student.consultations?.map(
                  (consultation) => (
                    <div
                      key={consultation._id}
                      className="border border-slate-200 rounded-2xl p-4 sm:p-5"
                    >
                      {/* TOP */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">
                            Predicted Disease
                          </p>

                          <h3 className="text-lg sm:text-xl font-bold text-slate-800 mt-1 break-words">
                            {
                              consultation.predictedDisease
                            }
                          </h3>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
                            <ShieldAlert
                              size={18}
                            />

                            {
                              consultation.confidence
                            }
                          </div>

                          <button
                            onClick={() =>
                              handleDeleteConsultation(
                                consultation._id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      {/* SYMPTOMS */}
                      <div className="mt-5">
                        <p className="text-sm font-semibold text-slate-600 mb-3">
                          Symptoms
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {consultation.symptoms?.map(
                            (
                              symptom,
                              index
                            ) => (
                              <span
                                key={index}
                                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm"
                              >
                                {symptom}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      {/* AI DETAILS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                        <div className="bg-slate-50 rounded-2xl p-4">
                          <p className="text-sm text-slate-500">
                            Medication
                          </p>

                          <h3 className="font-semibold text-slate-800 mt-2 leading-7 break-words">
                            {
                              consultation.medication
                            }
                          </h3>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">
                          <p className="text-sm text-slate-500">
                            Recommendation
                          </p>

                          <h3 className="font-semibold text-slate-800 mt-2 leading-7 break-words">
                            {
                              consultation.recommendation
                            }
                          </h3>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">
                          <p className="text-sm text-slate-500">
                            Precautions
                          </p>

                          <h3 className="font-semibold text-slate-800 mt-2 leading-7 break-words">
                            {
                              consultation.precautions
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SCROLL TO TOP BUTTON */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="
              fixed bottom-6 right-6 z-50
              w-14 h-14
              rounded-full
              bg-blue-600 hover:bg-blue-700
              text-white
              shadow-xl
              flex items-center justify-center
              transition-all duration-300
            "
          >
            <ChevronUp size={28} />
          </button>
        )}
      </main>
    </div>
  );
}

export default Students;