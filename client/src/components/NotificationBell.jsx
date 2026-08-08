import { useState, useEffect, useRef } from "react";
import { Bell, X, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load last seen ID from localStorage
  const getLastSeenId = () => localStorage.getItem("lastSeenConsultationId") || "";

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const students = res.data.students || [];

      // Flatten all consultations
      const allConsultations = students
        .flatMap((student) =>
          (student.consultations || []).map((c) => ({
            ...c,
            studentName: student.name,
            studentId: student._id,
          }))
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );

      // Take latest 8
      const latest = allConsultations.slice(0, 8);
      setNotifications(latest);

      // Calculate unread
      const lastSeen = getLastSeenId();
      if (!lastSeen && latest.length > 0) {
        setUnreadCount(latest.length);
      } else {
        const unread = latest.filter(
          (c) => (c._id || c.id) !== lastSeen
        ).length;
        setUnreadCount(Math.max(unread - 1, 0)); // rough count
      }
    } catch (error) {
      console.log("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // every 15s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = () => {
    if (notifications.length > 0) {
      const newestId = notifications[0]._id || notifications[0].id;
      localStorage.setItem("lastSeenConsultationId", newestId);
      setUnreadCount(0);
    }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) markAsRead();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <p className="text-xs text-slate-500">Latest consultations</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                No new notifications
              </div>
            ) : (
              notifications.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    navigate("/records");
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Activity size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {item.studentName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.predictedDisease || "New consultation"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(item.createdAt || item.date).toLocaleString()}
                      </p>
                    </div>
                    {(item.confidence === "High" ||
                      item.confidence === "Critical") && (
                      <span className="text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-lg">
                        Critical
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-3 bg-slate-50">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/records");
              }}
              className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all records
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;