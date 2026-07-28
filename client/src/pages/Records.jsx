import { useEffect, useState } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Activity,
  Trash2,
  Stethoscope,
  Search,
  Menu,
  X,
  ChevronUp,
} from 'lucide-react';

function Records() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState('');

  const [mobileMenu, setMobileMenu] = useState(false);

  // SCROLL BUTTON
  const [showScrollTop, setShowScrollTop] =
    useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  // SHOW SCROLL BUTTON
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener(
      'scroll',
      handleScroll
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  // SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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

  // DELETE CONSULTATION
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

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');
  };

  // FLATTEN CONSULTATIONS
  const consultations = students.flatMap(
    (student) =>
      (student.consultations || []).map(
        (consultation) => ({
          ...consultation,

          studentName: student.name,

          matricNumber:
            student.matricNumber,
        })
      )
  );

  // SEARCH
  const filteredConsultations =
    consultations.filter(
      (consultation) =>
        consultation.studentName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        consultation.predictedDisease
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* MOBILE OVERLAY */}
      {mobileMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() =>
            setMobileMenu(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px] bg-[#0f172a] text-white px-6 py-7 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300

        ${
          mobileMenu
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* TOP */}
          <div className="flex items-center justify-between mb-12">
            {/* LOGO */}
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

            {/* CLOSE */}
            <button
              onClick={() =>
                setMobileMenu(false)
              }
              className="lg:hidden"
            >
              <X size={26} />
            </button>
          </div>

          {/* MENU */}
          <div className="space-y-3">
            {/* DASHBOARD */}
            <button
              onClick={() =>
                navigate('/dashboard')
              }
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

            {/* CONSULTATION */}
            <button
              onClick={() =>
                navigate(
                  '/new-consultation'
                )
              }
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Stethoscope size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  New Consultation
                </h2>
              </div>
            </button>

            {/* STUDENTS */}
            <button
              onClick={() =>
                navigate('/students')
              }
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <Users size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  Check-in Records
                </h2>
              </div>
            </button>

            {/* RECORDS */}
            <button className="w-full flex items-center gap-4 bg-blue-600 text-white px-5 py-4 rounded-2xl transition">
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
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* MOBILE TOPBAR */}
        <div className="lg:hidden flex items-center justify-between mb-5">
          <button
            onClick={() =>
              setMobileMenu(true)
            }
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-bold text-slate-800">
            Records
          </h1>
        </div>

        {/* TOPBAR */}
        <div className="bg-white rounded-3xl border border-slate-200 px-4 md:px-6 py-5 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Students Records
            </h1>
          </div>

          {/* SEARCH */}
          <div className="flex items-center bg-slate-100 px-4 py-3 rounded-2xl w-full lg:w-[320px]">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-transparent outline-none ml-3 w-full text-sm"
            />
          </div>
        </div>

        {/* MOBILE CARDS */}
        <div className="lg:hidden mt-6 space-y-5">
          {filteredConsultations.map(
            (consultation) => (
              <div
                key={consultation._id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      {
                        consultation.studentName
                      }
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {
                        consultation.matricNumber
                      }
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteConsultation(
                        consultation._id
                      )
                    }
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4">
                  <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold">
                    {
                      consultation.predictedDisease
                    }
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {consultation.symptoms?.map(
                    (
                      symptom,
                      index
                    ) => (
                      <span
                        key={index}
                        className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs"
                      >
                        {symptom}
                      </span>
                    )
                  )}
                </div>

                <p className="text-sm text-slate-500 mt-5">
                  {new Date(
                    consultation.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Student
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Matric Number
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Symptoms
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Predicted Disease
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Time
                  </th>

                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredConsultations.map(
                  (consultation) => (
                    <tr
                      key={
                        consultation._id
                      }
                      className="border-t border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">
                        {
                          consultation.studentName
                        }
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {
                          consultation.matricNumber
                        }
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {consultation.symptoms?.map(
                            (
                              symptom,
                              index
                            ) => (
                              <span
                                key={index}
                                className="bg-slate-100 text-slate-700 px-3 py-1 rounded-xl text-xs"
                              >
                                {symptom}
                              </span>
                            )
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold">
                          {
                            consultation.predictedDisease
                          }
                        </span>
                      </td>

                      <td className="px-6 py-5 text-slate-500 text-sm whitespace-nowrap">
                        {new Date(
                          consultation.createdAt
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() =>
                            handleDeleteConsultation(
                              consultation._id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SCROLL TO TOP BUTTON */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
          >
            <ChevronUp size={26} />
          </button>
        )}
      </main>
    </div>
  );
}

export default Records;