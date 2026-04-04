import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Department } from "../types";
import { 
  Heart, 
  Brain, 
  Bone, 
  Eye, 
  Baby, 
  Activity, 
  Stethoscope, 
  Microscope, 
  ArrowRight, 
  Loader2, 
  Search,
  Sparkles,
  Ear
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const iconMap: Record<string, any> = {
  Heart, Brain, Bone, Eye, Baby, Activity, Stethoscope, Microscope, Sparkles, Ear
};

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "departments"), (snapshot) => {
      const depts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(depts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredDepts = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Our Departments</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            MediCore offers specialized medical care across a wide range of departments, each equipped with advanced technology and expert staff.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-green-600 shadow-xl shadow-slate-200/50 rounded-3xl transition-all outline-none text-slate-900 font-medium text-lg"
            />
          </div>
        </div>

        {/* Departments Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading departments...</p>
          </div>
        ) : filteredDepts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDepts.map((dept, i) => {
              const Icon = iconMap[dept.icon] || Stethoscope;
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-100 transition-all group border border-slate-100 overflow-hidden"
                >
                  {dept.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={dept.image} 
                        alt={dept.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="p-10 pt-6">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-2xl text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {dept.doctorCount || 0} Doctors
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">{dept.name}</h3>
                    <p className="text-slate-500 leading-relaxed mb-8 min-h-[80px]">
                      {dept.description || "Comprehensive medical care and advanced treatment options for patients of all ages."}
                    </p>
                    
                    <Link
                      to={`/doctors?dept=${dept.id}`}
                      className="inline-flex items-center text-green-600 font-bold hover:translate-x-2 transition-transform"
                    >
                      View Specialists
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-400 mb-6">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No departments found</h3>
            <p className="text-slate-500">Try adjusting your search to find what you're looking for.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-24 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Need help choosing a department?</h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed">
              Our patient care coordinators are available 24/7 to help you find the right specialist for your medical needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a href="tel:+15550001234" className="inline-flex items-center px-10 py-5 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-900/20">
                Call Support
              </a>
              <Link to="/doctors" className="inline-flex items-center px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                Find a Doctor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
