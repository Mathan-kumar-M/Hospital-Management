import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { collection, onSnapshot, limit, query } from "firebase/firestore";
import { db } from "../firebase";
import { Department } from "../types";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Shield, 
  Users, 
  Heart, 
  Activity, 
  Brain, 
  Bone, 
  Eye, 
  Baby,
  Stethoscope,
  Microscope,
  Sparkles,
  Ear
} from "lucide-react";
import { cn } from "../lib/utils";

const iconMap: Record<string, any> = {
  Heart, Brain, Bone, Eye, Baby, Activity, Stethoscope, Microscope, Sparkles, Ear
};

const Home: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "departments"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const depts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(depts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: "Expert Doctors", value: "150+", icon: Users },
    { label: "Happy Patients", value: "25k+", icon: Heart },
    { label: "Success Rate", value: "98%", icon: Activity },
    { label: "Years Experience", value: "20+", icon: Shield },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 bg-gradient-to-br from-green-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Trusted Healthcare Partner</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                Your Health is Our <span className="text-green-600 italic font-serif">Top Priority</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                Experience world-class medical care with state-of-the-art technology and compassionate experts. We are dedicated to your well-being.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all"
                >
                  Book Appointment
                  <Calendar className="ml-3 w-5 h-5" />
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-green-600 hover:text-green-600 transition-all"
                >
                  Find a Doctor
                  <ArrowRight className="ml-3 w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                  alt="Modern Hospital"
                  className="w-full h-[600px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-green-50 max-w-[200px]"
              >
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">24/7 Service</h4>
                <p className="text-xs text-slate-500">Always available for your emergencies</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-3xl shadow-2xl border border-green-50 max-w-[200px]"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-green-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-green-600">+150 Doctors</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Expert Team</h4>
                <p className="text-xs text-slate-500">World-class specialists at your service</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl hover:bg-green-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Preview */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-green-600 font-bold tracking-widest uppercase text-sm mb-4">Our Departments</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Specialized Care for <span className="text-green-600 italic font-serif">Every Patient</span>
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              We offer a wide range of medical services across various departments, each staffed with expert specialists and equipped with modern technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, i) => {
              const Icon = iconMap[dept.icon] || Stethoscope;
              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-100 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4">{dept.name}</h4>
                  <p className="text-slate-500 leading-relaxed mb-8 line-clamp-3">
                    {dept.description}
                  </p>
                  <Link
                    to="/departments"
                    className="inline-flex items-center text-green-600 font-bold hover:translate-x-2 transition-transform"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-16 text-center">
            <Link
              to="/departments"
              className="inline-flex items-center px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
            >
              View All Departments
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-green-600 rounded-[3rem] p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-green-200">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-green-500/20 skew-x-12 translate-x-1/4"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
                  Ready to experience <br />
                  <span className="italic font-serif text-green-100">Better Healthcare?</span>
                </h2>
                <p className="text-xl text-green-50 mb-12 leading-relaxed">
                  Join thousands of satisfied patients who trust MediCore for their healthcare needs. Book your first appointment today.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-10 py-5 bg-white text-green-600 rounded-2xl font-bold text-lg hover:bg-green-50 transition-colors shadow-xl"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center justify-center px-10 py-5 bg-green-700 text-white rounded-2xl font-bold text-lg hover:bg-green-800 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-lg p-10 rounded-[2rem] border border-white/20">
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-green-600">
                      <Calendar className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">Easy Booking</h4>
                      <p className="text-green-100">Book in less than 2 minutes</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-green-300"></div>
                        <div className="h-2 flex-grow bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${40 + i * 15}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
