import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../components/FirebaseProvider";
import { Appointment, Doctor, Report } from "../types";
import { 
  Calendar, 
  Clock, 
  User as UserIcon, 
  FileText, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  Loader2, 
  ChevronRight, 
  Settings, 
  LogOut, 
  Stethoscope, 
  Upload, 
  Download, 
  Trash2,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, isAfter, parseISO, startOfToday } from "date-fns";
import { cn } from "../lib/utils";

const Dashboard: React.FC = () => {
  const { user, firebaseUser, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [appointments, setAppointments] = useState<(Appointment & { doctor?: Doctor })[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports' | 'settings'>('appointments');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      navigate("/login");
      return;
    }

    // Fetch doctors first to map them to appointments
    const unsubscribeDoctors = onSnapshot(collection(db, "doctors"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(docs);
    });

    // Fetch appointments
    const qApp = query(
      collection(db, "appointments"),
      where("patientId", "==", firebaseUser.uid),
      orderBy("date", "desc")
    );
    const unsubscribeApp = onSnapshot(qApp, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apps);
      setLoading(false);
    });

    // Fetch reports
    const qRep = query(
      collection(db, "reports"),
      where("patientId", "==", firebaseUser.uid),
      orderBy("uploadedAt", "desc")
    );
    const unsubscribeRep = onSnapshot(qRep, (snapshot) => {
      const reps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      setReports(reps);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeApp();
      unsubscribeRep();
    };
  }, [firebaseUser, authLoading, navigate]);

  const handleCancelAppointment = async (appId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await updateDoc(doc(db, "appointments", appId), { status: "cancelled" });
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment.");
    }
  };

  const upcomingAppointments = appointments
    .filter(app => app.status !== "cancelled" && (isAfter(parseISO(app.date), startOfToday()) || app.date === format(startOfToday(), "yyyy-MM-dd")))
    .map(app => ({ ...app, doctor: doctors.find(d => d.id === app.doctorId) }));

  const pastAppointments = appointments
    .filter(app => app.status === "cancelled" || !isAfter(parseISO(app.date), startOfToday()) && app.date !== format(startOfToday(), "yyyy-MM-dd"))
    .map(app => ({ ...app, doctor: doctors.find(d => d.id === app.doctorId) }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-[2rem] bg-green-100 flex items-center justify-center text-green-600 overflow-hidden shadow-lg shadow-green-100">
                {user?.photo ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, {user?.name.split(' ')[0]}!</h1>
                <p className="text-slate-500 font-medium">Manage your health and appointments here.</p>
              </div>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Book New Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={cn(
                    "w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all",
                    activeTab === 'appointments' ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Calendar className="w-5 h-5 mr-4" />
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={cn(
                    "w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all",
                    activeTab === 'reports' ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <FileText className="w-5 h-5 mr-4" />
                  Medical Reports
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    "w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all",
                    activeTab === 'settings' ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Settings className="w-5 h-5 mr-4" />
                  Profile Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'appointments' && (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Upcoming */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                      <Clock3 className="w-6 h-6 mr-3 text-green-600" />
                      Upcoming Appointments
                    </h2>
                    {upcomingAppointments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {upcomingAppointments.map((app) => (
                          <div key={app.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-all group">
                            <div 
                              onClick={() => {
                                if (app.status === 'pending') {
                                  setToastMessage("Appointment accepted, wait for approval.");
                                }
                              }}
                              className="flex justify-between items-start mb-8 cursor-pointer"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 overflow-hidden group-hover:scale-110 transition-transform">
                                  {app.doctor?.photo ? (
                                    <img src={app.doctor.photo} alt={app.doctor.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Stethoscope className="w-7 h-7" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-lg">{app.doctor?.name || "Doctor"}</h4>
                                  <p className="text-green-600 font-bold text-xs uppercase tracking-widest">{app.doctor?.specialization || "Specialist"}</p>
                                </div>
                              </div>
                              <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                                app.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                              )}>
                                {app.status}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                              <div className="flex items-center text-slate-600 text-sm font-medium">
                                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                {format(parseISO(app.date), "MMM dd, yyyy")}
                              </div>
                              <div className="flex items-center text-slate-600 text-sm font-medium">
                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                {app.timeSlot}
                              </div>
                            </div>

                            <div className="flex space-x-4">
                              <button
                                onClick={() => handleCancelAppointment(app.id)}
                                className="flex-grow py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-red-50 hover:text-red-600 transition-all"
                              >
                                Cancel
                              </button>
                              <Link
                                to={`/doctors/${app.doctorId}`}
                                className="flex-grow py-3 bg-green-600 text-white text-center rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                              >
                                Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-12 rounded-[3rem] text-center border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                          <Calendar className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No upcoming appointments</h3>
                        <p className="text-slate-500 mb-8">You don't have any appointments scheduled at the moment.</p>
                        <Link to="/doctors" className="text-green-600 font-bold hover:underline">Find a doctor now</Link>
                      </div>
                    )}
                  </div>

                  {/* Past */}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                      <CheckCircle2 className="w-6 h-6 mr-3 text-slate-400" />
                      Past & Cancelled
                    </h2>
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                      {pastAppointments.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {pastAppointments.map((app) => (
                            <div key={app.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                              <div className="flex items-center space-x-4 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                  {app.doctor?.photo ? (
                                    <img src={app.doctor.photo} alt={app.doctor.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Stethoscope className="w-6 h-6" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900">{app.doctor?.name || "Doctor"}</h4>
                                  <p className="text-slate-500 text-xs">{app.doctor?.specialization}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-slate-500 text-sm">
                                  <div className="font-bold text-slate-700">{format(parseISO(app.date), "MMM dd, yyyy")}</div>
                                  <div>{app.timeSlot}</div>
                                </div>
                                <div className={cn(
                                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                                  app.status === 'confirmed' ? "bg-slate-100 text-slate-500" : "bg-red-50 text-red-600"
                                )}>
                                  {app.status === 'confirmed' ? 'Completed' : 'Cancelled'}
                                </div>
                                <Link to={`/doctors/${app.doctorId}`} className="p-2 text-slate-400 hover:text-green-600">
                                  <ChevronRight className="w-5 h-5" />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 text-center text-slate-400 italic">No past appointments found.</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reports' && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-12">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                      <FileText className="w-6 h-6 mr-3 text-green-600" />
                      Medical Reports
                    </h2>
                    <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload New
                    </button>
                  </div>

                  {reports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reports.map((report) => (
                        <div key={report.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl transition-all group">
                          <div className="flex items-center space-x-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                              <FileText className="w-8 h-8" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-bold text-slate-900 truncate" title={report.fileName}>{report.fileName}</h4>
                              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                                Uploaded {format(report.uploadedAt, "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-grow flex items-center justify-center py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-green-50 hover:text-green-600 transition-all"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                            <button className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-24 rounded-[3rem] text-center border border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-8">
                        <FileText className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">No medical reports</h3>
                      <p className="text-slate-500 mb-10">You haven't uploaded any medical reports or prescriptions yet.</p>
                      <button className="inline-flex items-center px-10 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-700 transition-all">
                        <Upload className="w-5 h-5 mr-3" />
                        Upload Your First Report
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-12 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-green-600" />
                    Profile Settings
                  </h2>
                  <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form className="space-y-8">
                      <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-4 border-white shadow-xl">
                            {user?.photo ? (
                              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon className="w-12 h-12" />
                            )}
                          </div>
                          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
                            <Upload className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex-grow w-full">
                          <h4 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h4>
                          <p className="text-slate-500 mb-4">{user?.email}</p>
                          <div className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                            isAdmin ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"
                          )}>
                            {isAdmin ? "Admin Account" : "Patient Account"}
                          </div>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-8">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                                <ShieldCheck className="w-6 h-6" />
                              </div>
                              <div>
                                <h5 className="font-bold text-purple-900">Administrator Access</h5>
                                <p className="text-purple-700 text-xs">You have access to the hospital management panel.</p>
                              </div>
                            </div>
                            <Link 
                              to="/admin" 
                              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors"
                            >
                              Go to Admin Panel
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Full Name</label>
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Phone Number</label>
                          <input
                            type="tel"
                            defaultValue={user?.phone}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                          />
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
