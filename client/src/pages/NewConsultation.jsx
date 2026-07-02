import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  Users,
  FileText,
  LogOut,
  Bell,
  Search,
  Plus,
  Menu,
  X,
} from "lucide-react";

function NewConsultation() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // FORM DATA
  const [formData, setFormData] =
    useState({
      name: "",
      matricNumber: "",
      department: "",
      level: "",
      symptoms: [],
    });

  // DEFAULT SYMPTOMS
  const [symptomsList, setSymptomsList] =
    useState([
      "Fever",
      "Headache",
      "Fatigue",
      "Body Pain",
      "Vomiting",
      "Weakness",
      "Stomach Pain",
      "Cough",
      "Sneezing",
      "Catarrh",
    ]);

  // NEW SYMPTOM INPUT
  const [newSymptom, setNewSymptom] =
    useState("");

  // PREDICTION RESULT
  const [
    predictionResult,
    setPredictionResult,
  ] = useState(null);

  // LOADING
  const [loading, setLoading] =
    useState(false);

  // HANDLE INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // HANDLE CHECKBOX
  const handleSymptomChange = (
    symptom
  ) => {
    if (
      formData.symptoms.includes(
        symptom
      )
    ) {
      setFormData({
        ...formData,
        symptoms:
          formData.symptoms.filter(
            (item) =>
              item !== symptom
          ),
      });
    } else {
      setFormData({
        ...formData,
        symptoms: [
          ...formData.symptoms,
          symptom,
        ],
      });
    }
  };

  // ADD NEW SYMPTOM
  const handleAddSymptom = () => {
    if (
      newSymptom.trim() !== "" &&
      !symptomsList.includes(
        newSymptom
      )
    ) {
      setSymptomsList([
        ...symptomsList,
        newSymptom,
      ]);

      setFormData({
        ...formData,
        symptoms: [
          ...formData.symptoms,
          newSymptom,
        ],
      });

      setNewSymptom("");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  // SUBMIT
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await API.post(
          "/predictions",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(
        response.data
      );

      setPredictionResult(
        response.data
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          "Prediction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px]
        bg-[#0f172a] text-white px-6 py-7 border-r border-slate-800
        transform transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
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
                <h1 className="text-xl font-bold">
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
                setSidebarOpen(false)
              }
            >
              <X size={24} />
            </button>
          </div>

          {/* MENU */}
          <div className="space-y-3">
            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <LayoutDashboard size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  Dashboard
                </h2>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 bg-blue-600 px-5 py-4 rounded-2xl transition">
              <Stethoscope size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  New Consultation
                </h2>
              </div>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/students"
                )
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

            <button
              onClick={() =>
                navigate(
                  "/records"
                )
              }
              className="w-full flex items-center gap-4 hover:bg-slate-800 px-5 py-4 rounded-2xl transition"
            >
              <FileText size={22} />

              <div className="text-left">
                <h2 className="font-semibold">
                  Records
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

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* TOPBAR */}
        <div className="bg-white rounded-3xl border border-slate-200 px-4 md:px-6 py-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                New Consultation
              </h1>

              <p className="text-slate-500 mt-1 text-sm md:text-base">
                Register student symptoms and
                predict diseases
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-3 rounded-2xl w-[260px]">
              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none ml-3 w-full text-sm"
              />
            </div>

            <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">
            Student Consultation Form
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* STUDENT DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-slate-300 rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                name="matricNumber"
                placeholder="Matric Number"
                value={
                  formData.matricNumber
                }
                onChange={handleChange}
                className="border border-slate-300 rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={
                  formData.department
                }
                onChange={handleChange}
                className="border border-slate-300 rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="text"
                name="level"
                placeholder="Level"
                value={formData.level}
                onChange={handleChange}
                className="border border-slate-300 rounded-2xl px-5 py-4 outline-none"
              />
            </div>

            {/* ADD SYMPTOM */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Add New Symptom
              </h3>

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Enter symptom..."
                  value={newSymptom}
                  onChange={(e) =>
                    setNewSymptom(
                      e.target.value
                    )
                  }
                  className="flex-1 border border-slate-300 rounded-2xl px-5 py-4 outline-none"
                />

                <button
                  type="button"
                  onClick={
                    handleAddSymptom
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Plus size={18} />

                  Add
                </button>
              </div>
            </div>

            {/* SYMPTOMS */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Select Symptoms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {symptomsList.map(
                  (symptom) => (
                    <label
                      key={symptom}
                      className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-4 cursor-pointer hover:border-blue-400 transition"
                    >
                      <input
                        type="checkbox"
                        checked={formData.symptoms.includes(
                          symptom
                        )}
                        onChange={() =>
                          handleSymptomChange(
                            symptom
                          )
                        }
                      />

                      {symptom}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              {loading
                ? "Running Prediction..."
                : "Run Prediction"}
            </button>
          </form>

          {/* RESULT */}
          {predictionResult && (
            <div className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-4 md:p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">
                Prediction Result
              </h2>

              {/* DISEASE */}
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Predicted Disease
                </p>

                <h3 className="text-3xl md:text-4xl font-bold text-blue-600 mt-2">
                  {
                    predictionResult.predictedDisease
                  }
                </h3>
              </div>

              {/* CONFIDENCE */}
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Confidence Level
                </p>

                <h4 className="text-xl font-semibold text-slate-800 mt-1">
                  {
                    predictionResult
                      ?.aiAnalysis
                      ?.confidence
                  }
                </h4>
              </div>

              {/* MEDICATION */}
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Medication
                </p>

                <h4 className="text-lg text-slate-700 mt-1 break-words">
                  {
                    predictionResult
                      ?.aiAnalysis
                      ?.medication
                  }
                </h4>
              </div>

              {/* RECOMMENDATION */}
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Recommendation
                </p>

                <h4 className="text-lg text-slate-700 mt-1 break-words">
                  {
                    predictionResult
                      ?.aiAnalysis
                      ?.recommendation
                  }
                </h4>
              </div>

              {/* PRECAUTIONS */}
              <div className="mb-6">
                <p className="text-sm text-slate-500">
                  Precautions
                </p>

                <h4 className="text-lg text-slate-700 mt-1 break-words">
                  {
                    predictionResult
                      ?.aiAnalysis
                      ?.precautions
                  }
                </h4>
              </div>

              {/* SYMPTOMS */}
              <div>
                <p className="text-sm text-slate-500 mb-3">
                  Symptoms Selected
                </p>

                <div className="flex flex-wrap gap-3">
                  {formData.symptoms.map(
                    (
                      symptom,
                      index
                    ) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {symptom}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default NewConsultation;