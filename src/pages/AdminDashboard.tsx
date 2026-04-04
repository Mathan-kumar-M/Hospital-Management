import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, getDocs, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../components/FirebaseProvider";
import { Appointment, Doctor, User, Department } from "../types";
import { 
  Users, 
  Calendar, 
  Stethoscope, 
  TrendingUp, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical, 
  Loader2, 
  LayoutDashboard, 
  UserPlus, 
  Settings, 
  Filter, 
  ChevronRight, 
  AlertCircle,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, startOfToday, isSameDay } from "date-fns";
import { cn } from "../lib/utils";

import { seedDatabase } from "../services/seedService";

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const handleSeed = async () => {
    setIsSeeding(true);
    const success = await seedDatabase();
    setIsSeeding(false);
    if (success) {
      // Success feedback could be a toast or state change
      console.log("Database seeded successfully!");
    }
  };
  
  const [appointments, setAppointments] = useState<(Appointment & { patient?: User, doctor?: Doctor })[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'doctors' | 'patients'>('overview');

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }

    // Sync admin role in Firestore if it's not set
    const syncAdminRole = async () => {
      if (user && user.role !== 'admin' && user.email.toLowerCase() === "kumarmathan2206@gmail.com") {
        try {
          await updateDoc(doc(db, "users", user.uid), { role: 'admin' });
        } catch (err) {
          console.error("Error syncing admin role:", err);
        }
      }
    };
    syncAdminRole();

    // Fetch all data
    const unsubscribeDoctors = onSnapshot(collection(db, "doctors"), (snapshot) => {
      setDoctors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor)));
    });

    const unsubscribePatients = onSnapshot(query(collection(db, "users"), where("role", "==", "patient")), (snapshot) => {
      setPatients(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User)));
    });

    const unsubscribeDepts = onSnapshot(collection(db, "departments"), (snapshot) => {
      const depts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(depts);
      
      // Auto-seed if database is empty
      if (depts.length === 0 && !isSeeding) {
        console.log("Database is empty, auto-seeding...");
        seedDatabase();
      }
    });

    const unsubscribeApp = onSnapshot(query(collection(db, "appointments"), orderBy("date", "desc")), (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apps);
      setLoading(false);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribePatients();
      unsubscribeDepts();
      unsubscribeApp();
    };
  }, [isAdmin, authLoading, navigate]);

  const handleUpdateStatus = async (appId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await updateDoc(doc(db, "appointments", appId), { status });
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  const stats = [
    { label: "Total Patients", value: patients.length, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Total Doctors", value: doctors.length, icon: Stethoscope, color: "bg-green-50 text-green-600" },
    { label: "Appointments Today", value: appointments.filter(a => a.date === format(startOfToday(), "yyyy-MM-dd")).length, icon: Calendar, color: "bg-purple-50 text-purple-600" },
    { label: "Pending Requests", value: appointments.filter(a => a.status === 'pending').length, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Control Panel</h1>
                <p className="text-slate-500 font-medium">Manage hospital operations, staff, and patients.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isSeeding ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <TrendingUp className="w-5 h-5 mr-2" />}
                Seed Data
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-xl shadow-green-100 hover:bg-green-700 transition-all">
                <Plus className="w-5 h-5 mr-2" />
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32">
              <nav className="space-y-2">
                {[
                  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
                  { id: 'appointments', name: 'Appointments', icon: Calendar },
                  { id: 'doctors', name: 'Doctors', icon: Stethoscope },
                  { id: 'patients', name: 'Patients', icon: Users },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={cn(
                      "w-full flex items-center px-6 py-4 rounded-2xl font-bold transition-all",
                      activeTab === item.id ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-4" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", stat.color)}>
                          <stat.icon className="w-7 h-7" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Pending Approvals Section */}
                  <div className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-lg shadow-yellow-100">
                          <Clock className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Pending Approvals</h2>
                      </div>
                      <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest">
                        {appointments.filter(a => a.status === 'pending').length} Pending
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                      {appointments.filter(a => a.status === 'pending').length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <th className="px-8 py-6">Patient</th>
                                <th className="px-8 py-6">Doctor</th>
                                <th className="px-8 py-6">Date & Time</th>
                                <th className="px-8 py-6">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {appointments.filter(a => a.status === 'pending').map((app) => {
                                const patient = patients.find(p => p.uid === app.patientId);
                                const doctor = doctors.find(d => d.id === app.doctorId);
                                return (
                                  <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                          {patient?.photo ? <img src={patient.photo} className="w-full h-full object-cover" /> : <Users className="w-5 h-5" />}
                                        </div>
                                        <div className="font-bold text-slate-900">{patient?.name || "Unknown"}</div>
                                      </div>
                                    </td>
                                    <td className="px-8 py-6">
                                      <div className="font-medium text-slate-700">{doctor?.name || "Unknown"}</div>
                                      <div className="text-xs text-slate-500">{doctor?.specialization}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                      <div className="font-medium text-slate-700">{format(parseISO(app.date), "MMM dd, yyyy")}</div>
                                      <div className="text-xs text-slate-500">{app.timeSlot}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                      <div className="flex items-center space-x-2">
                                        <button 
                                          onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                          className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                                        >
                                          Approve
                                        </button>
                                        <button 
                                          onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">All caught up!</h3>
                          <p className="text-slate-500">There are no pending appointment requests to approve.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Appointments */}
                  <div>
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold text-slate-900">Recent Appointments</h2>
                      <button onClick={() => setActiveTab('appointments')} className="text-green-600 font-bold hover:underline">View All</button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                              <th className="px-8 py-6">Patient</th>
                              <th className="px-8 py-6">Doctor</th>
                              <th className="px-8 py-6">Date & Time</th>
                              <th className="px-8 py-6">Status</th>
                              <th className="px-8 py-6">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {appointments.slice(0, 5).map((app) => {
                              const patient = patients.find(p => p.uid === app.patientId);
                              const doctor = doctors.find(d => d.id === app.doctorId);
                              return (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                  <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                        {patient?.photo ? <img src={patient.photo} className="w-full h-full object-cover" /> : <Users className="w-5 h-5" />}
                                      </div>
                                      <div className="font-bold text-slate-900">{patient?.name || "Unknown"}</div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="font-medium text-slate-700">{doctor?.name || "Unknown"}</div>
                                    <div className="text-xs text-slate-500">{doctor?.specialization}</div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="font-medium text-slate-700">{format(parseISO(app.date), "MMM dd, yyyy")}</div>
                                    <div className="text-xs text-slate-500">{app.timeSlot}</div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className={cn(
                                      "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                      app.status === 'confirmed' ? "bg-green-100 text-green-700" : 
                                      app.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                      {app.status}
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'doctors' && (
                <motion.div
                  key="doctors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <h2 className="text-2xl font-bold text-slate-900">Manage Doctors</h2>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search doctors..."
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-green-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center space-x-6 group">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                          {doctor.photo ? <img src={doctor.photo} className="w-full h-full object-cover" /> : <Stethoscope className="w-10 h-10" />}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-slate-900 truncate">{doctor.name}</h4>
                          <p className="text-green-600 font-bold text-xs uppercase tracking-widest mb-2">{doctor.specialization}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-xs text-slate-500">
                              <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
                              {doctor.rating || "4.9"}
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <Users className="w-3 h-3 mr-1" />
                              {departments.find(d => d.id === doctor.departmentId)?.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-400 hover:border-green-600 hover:text-green-600 transition-all group">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="font-bold">Add New Doctor</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appointments' && (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <h2 className="text-2xl font-bold text-slate-900">All Appointments</h2>
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                      <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search appointments..."
                          className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                      <button className="p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-500 hover:text-green-600 transition-all">
                        <Filter className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            <th className="px-8 py-6">Patient</th>
                            <th className="px-8 py-6">Doctor</th>
                            <th className="px-8 py-6">Date & Time</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {appointments.map((app) => {
                            const patient = patients.find(p => p.uid === app.patientId);
                            const doctor = doctors.find(d => d.id === app.doctorId);
                            return (
                              <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                      {patient?.photo ? <img src={patient.photo} className="w-full h-full object-cover" /> : <Users className="w-5 h-5" />}
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900">{patient?.name || "Unknown"}</div>
                                      <div className="text-xs text-slate-500">{patient?.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="font-medium text-slate-700">{doctor?.name || "Unknown"}</div>
                                  <div className="text-xs text-slate-500">{doctor?.specialization}</div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="font-medium text-slate-700">{format(parseISO(app.date), "MMM dd, yyyy")}</div>
                                  <div className="text-xs text-slate-500">{app.timeSlot}</div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className={cn(
                                    "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                    app.status === 'confirmed' ? "bg-green-100 text-green-700" : 
                                    app.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                  )}>
                                    {app.status}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                      className="p-2 text-slate-400 hover:text-green-600 transition-all"
                                      title="Confirm"
                                    >
                                      <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                                      className="p-2 text-slate-400 hover:text-red-600 transition-all"
                                      title="Cancel"
                                    >
                                      <XCircle className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                                      <MoreVertical className="w-5 h-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for parsing ISO strings safely
const parseISO = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default AdminDashboard;
