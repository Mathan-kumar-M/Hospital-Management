import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, setDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../components/FirebaseProvider";
import { Doctor, Department, Appointment } from "../types";
import { 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  Award, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { cn } from "../lib/utils";

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, firebaseUser } = useAuth();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "doctors", id));
        if (docSnap.exists()) {
          const doctorData = { id: docSnap.id, ...docSnap.data() } as Doctor;
          setDoctor(doctorData);
          
          // Fetch department
          const deptSnap = await getDoc(doc(db, "departments", doctorData.departmentId));
          if (deptSnap.exists()) {
            setDepartment({ id: deptSnap.id, ...deptSnap.data() } as Department);
          }
        } else {
          setError("Doctor not found");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!id || !selectedDate) return;
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const q = query(
        collection(db, "appointments"),
        where("doctorId", "==", id),
        where("date", "==", dateStr),
        where("status", "!=", "cancelled")
      );
      
      const snapshot = await getDocs(q);
      const slots = snapshot.docs.map(doc => (doc.data() as Appointment).timeSlot);
      setBookedSlots(slots);
    };

    fetchBookedSlots();
  }, [id, selectedDate]);

  const handleBooking = async () => {
    if (!firebaseUser) {
      navigate("/login", { state: { from: `/doctors/${id}` } });
      return;
    }

    if (!selectedSlot) return;

    setBookingLoading(true);
    try {
      const appRef = doc(collection(db, "appointments"));
      const appointmentData = {
        id: appRef.id,
        patientId: firebaseUser.uid,
        doctorId: id,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: selectedSlot,
        status: "pending",
        createdAt: new Date(),
        notes: ""
      };

      await setDoc(appRef, appointmentData);
      setBookingSuccess(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl text-center max-w-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{error || "Doctor not found"}</h2>
          <p className="text-slate-600 mb-8">We couldn't find the specialist you're looking for. They may have moved or the link is incorrect.</p>
          <Link to="/doctors" className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50/50 skew-x-12 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/doctors" className="inline-flex items-center text-slate-500 hover:text-green-600 font-bold mb-12 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Specialists
          </Link>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src={doctor.photo || `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500`}
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-green-50 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600">
                    <Star className="w-6 h-6 fill-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{doctor.rating || "4.9"}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-6">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  {department?.name || "Specialist"}
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">{doctor.name}</h1>
                <p className="text-2xl text-green-600 font-bold italic font-serif">{doctor.specialization}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Experience</div>
                  <div className="text-xl font-bold text-slate-900">{doctor.experience || "10+ Years"}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Patients</div>
                  <div className="text-xl font-bold text-slate-900">2,500+</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Reviews</div>
                  <div className="text-xl font-bold text-slate-900">480+</div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">About Doctor</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {doctor.bio || `${doctor.name} is a highly skilled ${doctor.specialization} with over 12 years of experience in providing exceptional medical care. Known for a compassionate approach and dedication to patient well-being, Dr. ${doctor.name.split(' ').pop()} has successfully treated thousands of patients and is a recognized leader in the field of ${doctor.specialization.toLowerCase()}.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Location & Contact</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">MediCore Main Hospital</h4>
                    <p className="text-slate-500 text-sm">123 Medical Plaza, Health City, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Certifications</h4>
                    <p className="text-slate-500 text-sm">Board Certified in {doctor.specialization}</p>
                  </div>
                </div>
                {doctor.availability && (
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Weekly Availability</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {doctor.availability.map((day: string) => (
                          <span key={day} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-green-100/50 border border-green-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Book an Appointment</h3>
                  <p className="text-slate-500">Select your preferred date and time slot</p>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instant Confirmation</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-12">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Select Date
                </h4>
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {[...Array(7)].map((_, i) => {
                    const date = addDays(startOfToday(), i);
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                        className={cn(
                          "flex flex-col items-center justify-center min-w-[100px] py-6 rounded-3xl border-2 transition-all",
                          isSelected 
                            ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 scale-105" 
                            : "bg-slate-50 border-transparent text-slate-600 hover:border-green-200 hover:bg-white"
                        )}
                      >
                        <span className={cn("text-xs font-bold uppercase tracking-widest mb-1", isSelected ? "text-green-100" : "text-slate-400")}>
                          {format(date, "EEE")}
                        </span>
                        <span className="text-2xl font-bold">{format(date, "dd")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="mb-12">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Available Time Slots
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {timeSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "py-4 rounded-2xl font-bold text-sm transition-all border-2",
                          isBooked 
                            ? "bg-slate-100 border-transparent text-slate-300 cursor-not-allowed" 
                            : isSelected
                              ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100"
                              : "bg-white border-slate-100 text-slate-700 hover:border-green-600 hover:text-green-600"
                        )}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-8 border-t border-slate-100">
                <AnimatePresence mode="wait">
                  {bookingSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 p-8 rounded-[2rem] text-center"
                    >
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-bold text-green-800 mb-2">Appointment accepted, wait for approval.</h4>
                      <p className="text-green-700">Redirecting you to your dashboard...</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="text-center md:text-left">
                        <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Selected Appointment</div>
                        <div className="text-xl font-bold text-slate-900">
                          {format(selectedDate, "MMMM dd, yyyy")} at {selectedSlot || "---"}
                        </div>
                      </div>
                      <button
                        onClick={handleBooking}
                        disabled={!selectedSlot || bookingLoading}
                        className="w-full md:w-auto px-12 py-5 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center"
                      >
                        {bookingLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                          <>
                            Confirm Booking
                            <ChevronRight className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
