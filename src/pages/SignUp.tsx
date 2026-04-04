import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Stethoscope, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Phone } from "lucide-react";
import { motion } from "motion/react";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUp: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: data.name });

      // Create user profile in Firestore
      const isAdminEmail = data.email.toLowerCase() === "kumarmathan2206@gmail.com";
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: isAdminEmail ? "admin" : "patient",
        createdAt: new Date()
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-200">
              <Stethoscope className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold text-slate-900 tracking-tight">
              Medi<span className="text-green-600">Core</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-500">Join MediCore for better healthcare services</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 p-10 border border-slate-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start space-x-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  {...register("name")}
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 ml-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  {...register("phone")}
                  type="tel"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500 ml-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500 ml-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-2xl transition-all outline-none text-slate-900 font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 ml-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-bold hover:text-green-700">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
