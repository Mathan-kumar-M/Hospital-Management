import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Doctor, Department } from "../types";
import { Search, Filter, Star, Calendar, MapPin, Loader2, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  useEffect(() => {
    const unsubscribeDoctors = onSnapshot(collection(db, "doctors"), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(docs);
      setLoading(false);
    });

    const unsubscribeDepts = onSnapshot(collection(db, "departments"), (snapshot) => {
      const depts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(depts);
    });

    return () => {
      unsubscribeDoctors();
      unsubscribeDepts();
    };
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || doctor.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Our Specialists</h1>
          <p className="text-slate-600 max-w-2xl">
            Find and book appointments with our world-class medical experts across various specializations.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-12 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
            />
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Filter className="text-slate-400 w-5 h-5 hidden md:block" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="flex-grow md:w-64 px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium appearance-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading specialists...</p>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDoctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-100 transition-all group border border-slate-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={doctor.photo || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500`}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold text-slate-900">{doctor.rating || "4.9"}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Available Today
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-green-600 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-green-600 font-bold text-sm uppercase tracking-wider">
                      {doctor.specialization}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Stethoscope className="w-4 h-4 mr-2 text-slate-400" />
                      <span>{departments.find(d => d.id === doctor.departmentId)?.name || "General Medicine"}</span>
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      <span>MediCore Main Branch</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-slate-200"
                  >
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-400 mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedDept("all"); }}
              className="mt-8 text-green-600 font-bold hover:text-green-700 underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
